import { getHabits } from "../services/HabitService";
import { getAllHabitRecords } from "../services/HabitRecordService";
import type { Habit } from "../types/Habit";
import type { HabitRecord } from "../types/HabitRecord";
import type { HabitStats } from "../types/HabitStats";

export async function stats(element: HTMLElement): Promise<void> {
    element.innerHTML = "";
    const heading = document.createElement("h1");
    heading.textContent = "As tuas estatísticas";
    element.appendChild(heading);

    try {
        const [habits, records] = await Promise.all([getHabits(), getAllHabitRecords()]);
        const summary = calculateStats(habits, records, new Date());
        renderStats(element, summary);
    } catch {
        const error = document.createElement("p");
        error.textContent = "Não foi possível carregar as estatísticas. Confirma se a API está disponível e tenta novamente.";
        element.appendChild(error);
    }
}

function calculateStats(habits: Habit[], records: HabitRecord[], now: Date): HabitStats {
    const today = toDateString(now);
    const periodEnd = today;
    const periodStart = addDays(today, -6);
    const recordByHabitAndDate = new Map(records.map(record => [`${record.habitId}:${record.recordDate.slice(0, 10)}`, record]));

    let completedHabits = 0;
    let opportunities = 0;
    for (let date = periodStart; date <= periodEnd; date = addDays(date, 1)) {
        for (const habit of habitsScheduledOn(habits, date)) {
            const isCompleted = recordByHabitAndDate.get(`${habit.id}:${date}`)?.habitState === "Completed";
            if (isCompleted) {
                completedHabits++;
            } else if (date < today) {
                // Today's habits are still in progress, so they are not missed yet.
                opportunities++;
            }
        }
    }

    const missedHabits = opportunities;
    const finalizedOpportunities = completedHabits + missedHabits;
    const todayHabits = habitsScheduledOn(habits, today);
    const todayIsComplete = todayHabits.length > 0 && todayHabits.every(habit => recordByHabitAndDate.get(`${habit.id}:${today}`)?.habitState === "Completed");
    const streakStart = todayIsComplete ? today : addDays(today, -1);
    const currentStreak = calculateCurrentStreak(habits, recordByHabitAndDate, streakStart);
    const startLabel = formatDate(periodStart);
    const endLabel = formatDate(periodEnd);

    return {
        completionRate: finalizedOpportunities === 0 ? 0 : Math.round((completedHabits / finalizedOpportunities) * 100),
        completedHabits,
        missedHabits,
        currentStreak,
        periodLabel: `Últimos 7 dias · ${startLabel} – ${endLabel}`
    };
}

function calculateCurrentStreak(habits: Habit[], records: Map<string, HabitRecord>, startingDate: string): number {
    let streak = 0;
    for (let date = startingDate; ; date = addDays(date, -1)) {
        const activeHabits = habitsActiveOn(habits, date);
        if (activeHabits.length === 0) break;
        const dailyHabits = activeHabits.filter(habit => isScheduledOn(habit, date));
        if (dailyHabits.length === 0) continue;
        if (dailyHabits.some(habit => records.get(`${habit.id}:${date}`)?.habitState !== "Completed")) break;
        streak++;
    }
    return streak;
}

function habitsActiveOn(habits: Habit[], date: string): Habit[] {
    return habits.filter(habit => habit.startDate.slice(0, 10) <= date && (!habit.endDate || habit.endDate.slice(0, 10) >= date));
}

function habitsScheduledOn(habits: Habit[], date: string): Habit[] {
    return habitsActiveOn(habits, date).filter(habit => isScheduledOn(habit, date));
}

function isScheduledOn(habit: Habit, date: string): boolean {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(year, month - 1, day).getDay()];
    return weekday !== undefined && habit.daysOfWeek.includes(weekday as Habit["daysOfWeek"][number]);
}

function renderStats(element: HTMLElement, summary: HabitStats): void {
    const period = document.createElement("p");
    period.className = "stats-period";
    period.textContent = summary.periodLabel;
    element.appendChild(period);

    const list = document.createElement("dl");
    list.className = "stats-grid";
    const values: Array<[string, string, string]> = [
        ["Completion Rate", `${summary.completionRate}%`, "Percentagem de hábitos concluídos no período"],
        ["Completed Habits", String(summary.completedHabits), "Total de hábitos concluídos no período"],
        ["Missed Habits", String(summary.missedHabits), "Total de hábitos que não foram concluídos"],
        ["Current Streak", `${summary.currentStreak} ${summary.currentStreak === 1 ? "dia" : "dias"}`, "Dias previstos consecutivos com todos os hábitos concluídos"]
    ];

    for (const [title, value, description] of values) {
        const card = document.createElement("div");
        card.className = "stats-card";
        const term = document.createElement("dt");
        term.textContent = title;
        const amount = document.createElement("dd");
        amount.className = "stats-value";
        amount.textContent = value;
        const detail = document.createElement("p");
        detail.textContent = description;
        card.append(term, amount, detail);
        list.appendChild(card);
    }
    element.appendChild(list);
}

function toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: string, amount: number): string {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    const result = new Date(year, month - 1, day + amount);
    return toDateString(result);
}

function formatDate(date: string): string {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}
