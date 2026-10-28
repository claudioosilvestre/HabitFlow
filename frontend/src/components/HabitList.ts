import { iconSvg } from "../lib/icons";
import { dayLabels, priorityLabels } from "../lib/labels";
import type { Habit } from "../types/Habit";
import { formatDateRange, formatDuration, habitStatus } from "../utils/habits";

const statusLabels = {
    active: "Ativo",
    upcoming: "A começar",
    ended: "Terminado"
} as const;

export function listHabits(
    element: HTMLElement,
    habits: Habit[],
    onEdit: (habit: Habit) => void,
    onDelete: (habit: Habit) => void
): void {
    element.innerHTML = "";

    const list = document.createElement("ul");
    list.className = "habit-list";

    habits.forEach(habit => {
        const line = document.createElement("li");
        const status = habitStatus(habit);
        line.className = `habit-card status-${status}`;

        const body = document.createElement("div");
        body.className = "habit-card-body";

        const titleRow = document.createElement("div");
        titleRow.className = "habit-title-row";
        const name = document.createElement("strong");
        name.textContent = habit.name;
        const statusBadge = document.createElement("span");
        statusBadge.className = `habit-status status-${status}`;
        statusBadge.textContent = statusLabels[status];
        titleRow.append(name, statusBadge);

        const meta = document.createElement("div");
        meta.className = "habit-meta";

        const priority = document.createElement("span");
        priority.className = `habit-priority priority-${habit.habitPriority.toLowerCase()}`;
        priority.textContent = priorityLabels[habit.habitPriority];

        const schedule = document.createElement("span");
        schedule.className = "habit-schedule";
        schedule.textContent = habit.daysOfWeek.map(day => dayLabels[day]).join(" · ");

        const dates = document.createElement("span");
        dates.className = "habit-duration";
        dates.textContent = formatDateRange(habit);

        meta.append(priority, schedule, dates);

        const duration = formatDuration(habit.duration);
        if (duration) {
            const durationLabel = document.createElement("span");
            durationLabel.className = "habit-duration";
            durationLabel.textContent = duration;
            meta.appendChild(durationLabel);
        }

        body.append(titleRow, meta);

        if (habit.description) {
            const description = document.createElement("p");
            description.className = "habit-description";
            description.textContent = habit.description;
            body.appendChild(description);
        }

        const actions = document.createElement("div");
        actions.className = "habit-actions";

        const editButton = iconAction("Editar hábito", "edit", () => onEdit(habit));
        const deleteButton = iconAction("Apagar hábito", "trash", () => onDelete(habit), "danger");
        actions.append(editButton, deleteButton);
        line.append(body, actions);
        list.appendChild(line);
    });

    element.appendChild(list);
}

function iconAction(label: string, icon: "edit" | "trash", onClick: () => void, variant = "secondary"): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-button ${variant}`;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = iconSvg(icon);
    button.addEventListener("click", onClick);
    return button;
}
