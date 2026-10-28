import type { Habit } from "../types/Habit";
import { HabitPriority } from "../types/HabitPriority";

const dayLabels: Record<string, string> = {
    Monday: "Seg", Tuesday: "Ter", Wednesday: "Qua", Thursday: "Qui",
    Friday: "Sex", Saturday: "Sáb", Sunday: "Dom"
};

const priorityLabels: Record<HabitPriority, string> = {
    [HabitPriority.Low]: "Baixa",
    [HabitPriority.Medium]: "Média",
    [HabitPriority.High]: "Alta",
    [HabitPriority.Urgent]: "Urgente"
};

export function listHabits(
    element: HTMLElement,
    habits: Habit[],
    onEdit: (habit: Habit) => void,
    onDelete: (habit: Habit) => void
): void {
    element.innerHTML = "";

    if (habits.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Ainda não criaste nenhum hábito. Começa por adicionar o primeiro.";
        element.appendChild(empty);
        return;
    }

    const list = document.createElement("ul");
    list.className = "habit-list";

    habits.forEach(habit => {
        const line = document.createElement("li");
        line.className = "habit-card";

        const body = document.createElement("div");
        body.className = "habit-card-body";

        const name = document.createElement("strong");
        name.textContent = habit.name;

        const meta = document.createElement("div");
        meta.className = "habit-meta";

        const priority = document.createElement("span");
        priority.className = `habit-priority priority-${habit.habitPriority.toLowerCase()}`;
        priority.textContent = priorityLabels[habit.habitPriority];

        const schedule = document.createElement("span");
        schedule.className = "habit-schedule";
        schedule.textContent = habit.daysOfWeek.map(day => dayLabels[day]).join(" · ");

        meta.append(priority, schedule);

        const duration = formatDuration(habit.duration);
        if (duration) {
            const durationLabel = document.createElement("span");
            durationLabel.className = "habit-duration";
            durationLabel.textContent = duration;
            meta.appendChild(durationLabel);
        }

        body.append(name, meta);

        if (habit.description) {
            const description = document.createElement("p");
            description.className = "habit-description";
            description.textContent = habit.description;
            body.appendChild(description);
        }

        const actions = document.createElement("div");
        actions.className = "habit-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "secondary";
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => onEdit(habit));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "danger";
        deleteButton.textContent = "Apagar";
        deleteButton.addEventListener("click", () => onDelete(habit));

        actions.append(editButton, deleteButton);
        line.append(body, actions);
        list.appendChild(line);
    });

    element.appendChild(list);
}

function formatDuration(duration: string | null): string | null {
    if (!duration) return null;
    const [hours, minutes] = duration.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
}
