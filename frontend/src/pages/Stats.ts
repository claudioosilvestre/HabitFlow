import { getHabits } from "../services/HabitService";
import { getAllHabitRecords } from "../services/HabitRecordService";
import type { Habit } from "../types/Habit";
import type { HabitRecord } from "../types/HabitRecord";
import { addDays, isActiveOnDate, isScheduledOn, toDateString } from "../utils/dates";
import { formatDateLabel } from "../utils/habits";
import { renderErrorState, renderSkeleton } from "../ui/feedback";

interface StatsSummary {
    completionRate: number;
    completedHabits: number;
    missedHabits: number;
    currentStreak: number;
    periodLabel: string;
    periodDays: number;
}

interface HabitBreakdown {
    habit: Habit;
    completed: number;
    missed: number;
    rate: number;
}

type DayLevel = "none" | "empty" | "low" | "mid" | "full";

interface HeatDay {
    date: string;
    level: DayLevel;
    label: string;
}

const PERIODS = [7, 30, 90] as const;

export async function stats(element: HTMLElement): Promise<void> {
    element.innerHTML = "";
    let periodDays: (typeof PERIODS)[number] = 7;

    const heading = document.createElement("div");
    heading.className = "page-heading";
    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "O teu ritmo";
    const period = document.createElement("p");
    period.className = "stats-period";
    heading.append(title, period);

    const chips = document.createElement("div");
    chips.className = "chip-row";
    const chipButtons = new Map<number, HTMLButtonElement>();
    PERIODS.forEach(days => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `chip${days === 7 ? " active" : ""}`;
        button.textContent = `${days} dias`;
        button.addEventListener("click", () => {
            periodDays = days;
            chipButtons.forEach((item, key) => item.classList.toggle("active", key === days));
            void load();
        });
        chipButtons.set(days, button);
        chips.appendChild(button);
    });
    heading.appendChild(chips);
    element.appendChild(heading);

    const content = document.createElement("div");
    element.appendChild(content);
    renderSkeleton(content, 6);

    async function load(): Promise<void> {
        renderSkeleton(content, 6);
        try {
            const [habits, records] = await Promise.all([getHabits(), getAllHabitRecords()]);
            const now = new Date();
            const summary = calculateStats(habits, records, now, periodDays);
            period.textContent = summary.periodLabel;
            renderStats(content, summary, habits, records, now);
        } catch {
            renderErrorState(content, "Confirma se a API está disponível e tenta novamente.", () => {
                void load();
            });
        }
    }

    await load();
}

function calculateStats(habits: Habit[], records: HabitRecord[], now: Date, periodDays: number): StatsSummary {
    const today = toDateString(now);
    const periodEnd = today;
    const periodStart = addDays(today, -(periodDays - 1));
    const recordByHabitAndDate = new Map(records.map(record => [`${record.habitId}:${record.recordDate.slice(0, 10)}`, record]));

    let completedHabits = 0;
    let opportunities = 0;
    for (let date = periodStart; date <= periodEnd; date = addDays(date, 1)) {
        for (const habit of habitsScheduledOn(habits, date)) {
            const isCompleted = recordByHabitAndDate.get(`${habit.id}:${date}`)?.habitState === "Completed";
            if (isCompleted) completedHabits += 1;
            else if (date < today) opportunities += 1;
        }
    }

    const missedHabits = opportunities;
    const finalizedOpportunities = completedHabits + missedHabits;
    const todayHabits = habitsScheduledOn(habits, today);
    const todayIsComplete = todayHabits.length > 0 && todayHabits.every(habit => recordByHabitAndDate.get(`${habit.id}:${today}`)?.habitState === "Completed");
    const streakStart = todayIsComplete ? today : addDays(today, -1);
    const currentStreak = calculateCurrentStreak(habits, recordByHabitAndDate, streakStart);

    return {
        completionRate: finalizedOpportunities === 0 ? 0 : Math.round((completedHabits / finalizedOpportunities) * 100),
        completedHabits,
        missedHabits,
        currentStreak,
        periodDays,
        periodLabel: `${periodDays} dias · ${formatDateLabel(periodStart)} – ${formatDateLabel(periodEnd)}`
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
        streak += 1;
    }
    return streak;
}

function habitsActiveOn(habits: Habit[], date: string): Habit[] {
    return habits.filter(habit => isActiveOnDate(habit, date));
}

function habitsScheduledOn(habits: Habit[], date: string): Habit[] {
    return habitsActiveOn(habits, date).filter(habit => isScheduledOn(habit, date));
}

function renderStats(element: HTMLElement, summary: StatsSummary, habits: Habit[], records: HabitRecord[], now: Date): void {
    element.innerHTML = "";

    const list = document.createElement("dl");
    list.className = "stats-grid";
    const values: Array<[string, string, string]> = [
        ["Taxa de conclusão", `${summary.completionRate}%`, "Hábitos concluídos no período"],
        ["Concluídos", String(summary.completedHabits), "Marcações feitas a tempo"],
        ["Em falta", String(summary.missedHabits), "Dias previstos que ficaram por marcar"],
        ["Sequência", `${summary.currentStreak} ${summary.currentStreak === 1 ? "dia" : "dias"}`, "Dias seguidos com tudo concluído"]
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

    const heatSection = document.createElement("section");
    heatSection.className = "stats-section";
    const heatTitle = document.createElement("h3");
    heatTitle.textContent = "Últimas 12 semanas";
    heatSection.append(heatTitle, renderHeatmap(habits, records, now));
    element.appendChild(heatSection);

    const breakdown = habitBreakdown(habits, records, now, summary.periodDays);
    const breakSection = document.createElement("section");
    breakSection.className = "stats-section";
    const breakTitle = document.createElement("h3");
    breakTitle.textContent = "Por hábito";
    breakSection.appendChild(breakTitle);

    if (breakdown.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Ainda não há histórico suficiente neste período.";
        breakSection.appendChild(empty);
    } else {
        const table = document.createElement("ul");
        table.className = "habit-breakdown";
        breakdown.forEach(row => {
            const item = document.createElement("li");
            const name = document.createElement("strong");
            name.textContent = row.habit.name;
            const meta = document.createElement("span");
            meta.textContent = `${row.completed} concluídos · ${row.missed} em falta`;
            const rate = document.createElement("span");
            rate.className = "breakdown-rate";
            rate.textContent = `${row.rate}%`;
            const bar = document.createElement("div");
            bar.className = "progress-bar";
            const fill = document.createElement("div");
            fill.className = "progress-fill";
            fill.style.width = `${row.rate}%`;
            bar.appendChild(fill);
            item.append(name, rate, meta, bar);
            table.appendChild(item);
        });
        breakSection.appendChild(table);
    }
    element.appendChild(breakSection);
}

function renderHeatmap(habits: Habit[], records: HabitRecord[], now: Date): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "heatmap";
    const days = heatDays(habits, records, now);
    const weekdays = ["S", "T", "Q", "Q", "S", "S", "D"];
    const labels = document.createElement("div");
    labels.className = "heatmap-labels";
    weekdays.forEach(label => {
        const item = document.createElement("span");
        item.textContent = label;
        labels.appendChild(item);
    });

    const grid = document.createElement("div");
    grid.className = "heatmap-grid";
    days.forEach(day => {
        const cell = document.createElement("span");
        cell.className = `heat-cell heat-${day.level}`;
        cell.title = day.label;
        grid.appendChild(cell);
    });

    wrap.append(labels, grid);
    return wrap;
}

function heatDays(habits: Habit[], records: HabitRecord[], now: Date): HeatDay[] {
    const today = toDateString(now);
    const todayDate = parseDate(today);
    const weekday = (todayDate.getDay() + 6) % 7;
    const start = addDays(today, -(11 * 7 + weekday));
    const recordByHabitAndDate = new Map(records.map(record => [`${record.habitId}:${record.recordDate.slice(0, 10)}`, record]));
    const days: HeatDay[] = [];

    for (let date = start; date <= today; date = addDays(date, 1)) {
        const scheduled = habitsScheduledOn(habits, date);
        if (scheduled.length === 0) {
            days.push({ date, level: "none", label: `${formatDateLabel(date)} · sem hábitos` });
            continue;
        }
        const completed = scheduled.filter(habit => recordByHabitAndDate.get(`${habit.id}:${date}`)?.habitState === "Completed").length;
        const ratio = completed / scheduled.length;
        const level: DayLevel = ratio === 0 ? "empty" : ratio < 0.67 ? "low" : ratio < 1 ? "mid" : "full";
        days.push({
            date,
            level: date > today ? "none" : level,
            label: `${formatDateLabel(date)} · ${completed}/${scheduled.length} concluídos`
        });
    }
    return days;
}

function habitBreakdown(habits: Habit[], records: HabitRecord[], now: Date, periodDays: number): HabitBreakdown[] {
    const today = toDateString(now);
    const periodStart = addDays(today, -(periodDays - 1));
    const recordByHabitAndDate = new Map(records.map(record => [`${record.habitId}:${record.recordDate.slice(0, 10)}`, record]));
    return habits.map(habit => {
        let completed = 0;
        let missed = 0;
        for (let date = periodStart; date <= today; date = addDays(date, 1)) {
            if (!isActiveOnDate(habit, date) || !isScheduledOn(habit, date)) continue;
            if (recordByHabitAndDate.get(`${habit.id}:${date}`)?.habitState === "Completed") completed += 1;
            else if (date < today) missed += 1;
        }
        const total = completed + missed;
        return {
            habit,
            completed,
            missed,
            rate: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    }).filter(row => row.completed + row.missed > 0)
        .sort((a, b) => b.rate - a.rate || a.habit.name.localeCompare(b.habit.name, "pt"));
}

function parseDate(date: string): Date {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}
