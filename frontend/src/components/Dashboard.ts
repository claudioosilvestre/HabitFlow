import { getHabits } from "../services/HabitService";
import { getHabitRecordsByDate, saveHabitCompletion } from "../services/HabitRecordService";
import type { Habit } from "../types/Habit";
import type { HabitRecord } from "../types/HabitRecord";

export async function dashboard(element: HTMLElement): Promise<void> {
    element.innerHTML = "";

    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const heading = document.createElement("h1");
    heading.textContent = "Os teus hábitos de hoje";
    element.appendChild(heading);

    const subtitle = document.createElement("p");
    subtitle.className = "dashboard-date";
    subtitle.textContent = today.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
    element.appendChild(subtitle);

    const content = document.createElement("div");
    element.appendChild(content);

    try {
        const [habits, records] = await Promise.all([getHabits(), getHabitRecordsByDate(date)]);
        const activeHabits = habits.filter(habit => isActiveOnDate(habit, date));
        const recordByHabit = new Map<number, HabitRecord>(records.map(record => [record.habitId, record]));
        const progress = document.createElement("p");
        progress.className = "dashboard-progress";
        content.appendChild(progress);
        updateProgress(progress, activeHabits, recordByHabit);

        if (activeHabits.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Ainda não tens hábitos ativos para hoje.";
            content.appendChild(empty);
            return;
        }

        const list = document.createElement("ul");
        list.className = "dashboard-habit-list";
        activeHabits.forEach(habit => list.appendChild(createHabitItem(habit, date, recordByHabit, activeHabits, progress)));
        content.appendChild(list);
    } catch {
        const error = document.createElement("p");
        error.textContent = "Não foi possível carregar os hábitos de hoje. Confirma se a API está disponível e tenta novamente.";
        content.appendChild(error);
    }
}

function createHabitItem(habit: Habit, date: string, records: Map<number, HabitRecord>, habits: Habit[], progress: HTMLElement): HTMLLIElement {
    const record = records.get(habit.id);
    const isCompleted = record?.habitState === "Completed";
    const item = document.createElement("li");
    item.className = isCompleted ? "dashboard-habit completed" : "dashboard-habit";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.setAttribute("aria-label", `Marcar ${habit.name} como concluído`);
    const name = document.createElement("span");
    name.textContent = habit.name;
    label.append(checkbox, name);
    item.appendChild(label);

    if (habit.description) {
        const description = document.createElement("p");
        description.textContent = habit.description;
        item.appendChild(description);
    }

    checkbox.addEventListener("change", async () => {
        checkbox.disabled = true;
        try {
            const updatedRecord = await saveHabitCompletion(habit.id, date, checkbox.checked, records.get(habit.id));
            records.set(habit.id, updatedRecord);
            item.classList.toggle("completed", checkbox.checked);
            updateProgress(progress, habits, records);
        } catch {
            checkbox.checked = !checkbox.checked;
            alert("Não foi possível guardar o estado do hábito. Tenta novamente.");
        } finally {
            checkbox.disabled = false;
        }
    });

    return item;
}

function updateProgress(element: HTMLElement, habits: Habit[], records: Map<number, HabitRecord>): void {
    const completedCount = habits.filter(habit => records.get(habit.id)?.habitState === "Completed").length;
    element.textContent = `${completedCount} de ${habits.length} concluídos`;
}

function isActiveOnDate(habit: Habit, date: string): boolean {
    return habit.startDate.slice(0, 10) <= date && (!habit.endDate || habit.endDate.slice(0, 10) >= date);
}
