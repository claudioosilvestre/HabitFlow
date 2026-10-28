import { getHabits } from "../services/HabitService";
import { getHabitRecordsByDate, saveHabitCompletion } from "../services/HabitRecordService";
import type { Habit } from "../types/Habit";
import type { HabitRecord } from "../types/HabitRecord";
import { addDays, isDueOnDate, toDateString } from "../utils/dates";
import { compareHabits, formatDuration, greeting } from "../utils/habits";
import { priorityLabels } from "../labels";
import { iconSvg } from "../icons";
import { navigate } from "../router";
import { renderEmptyState, renderErrorState, renderSkeleton } from "../ui/feedback";
import { showToast } from "../ui/toast";

const FUTURE_LIMIT = 7;

export async function dashboard(element: HTMLElement): Promise<void> {
    element.innerHTML = "";
    let selectedDate = toDateString(new Date());

    const header = document.createElement("div");
    header.className = "page-heading";
    const title = document.createElement("h2");
    title.className = "page-title";
    const subtitle = document.createElement("p");
    subtitle.className = "dashboard-date";
    header.append(title, subtitle);

    const nav = document.createElement("div");
    nav.className = "day-nav";
    const prev = navButton("Dia anterior", "chevronLeft");
    const todayButton = document.createElement("button");
    todayButton.type = "button";
    todayButton.className = "secondary day-nav-today";
    todayButton.textContent = "Hoje";
    const next = navButton("Dia seguinte", "chevronRight");
    nav.append(prev, todayButton, next);
    header.appendChild(nav);
    element.appendChild(header);

    const content = document.createElement("div");
    element.appendChild(content);
    renderSkeleton(content);

    prev.addEventListener("click", () => {
        selectedDate = addDays(selectedDate, -1);
        void load();
    });
    next.addEventListener("click", () => {
        selectedDate = addDays(selectedDate, 1);
        void load();
    });
    todayButton.addEventListener("click", () => {
        selectedDate = toDateString(new Date());
        void load();
    });

    async function load(): Promise<void> {
        const today = toDateString(new Date());
        const isToday = selectedDate === today;
        title.textContent = isToday ? `${greeting()}.` : "Os teus hábitos";
        subtitle.textContent = formatLongDate(selectedDate);
        todayButton.hidden = isToday;
        next.disabled = selectedDate >= addDays(today, FUTURE_LIMIT);
        renderSkeleton(content);

        try {
            const [habits, records] = await Promise.all([getHabits(), getHabitRecordsByDate(selectedDate)]);
            const activeHabits = habits.filter(habit => isDueOnDate(habit, selectedDate)).sort((a, b) => {
                const aDone = records.some(record => record.habitId === a.id && record.habitState === "Completed") ? 1 : 0;
                const bDone = records.some(record => record.habitId === b.id && record.habitState === "Completed") ? 1 : 0;
                if (aDone !== bDone) return aDone - bDone;
                return compareHabits(a, b);
            });
            const recordByHabit = new Map<number, HabitRecord>(records.map(record => [record.habitId, record]));
            renderDay(content, selectedDate, isToday, activeHabits, recordByHabit);
        } catch {
            renderErrorState(content, "Confirma se a API está disponível e tenta novamente.", () => {
                void load();
            });
        }
    }

    await load();
}

function renderDay(
    content: HTMLElement,
    date: string,
    isToday: boolean,
    habits: Habit[],
    records: Map<number, HabitRecord>
): void {
    content.innerHTML = "";

    if (habits.length === 0) {
        renderEmptyState(
            content,
            isToday ? "Nada agendado para hoje" : "Nada agendado neste dia",
            isToday
                ? "Cria um hábito ou verifica se algum está marcado para este dia da semana."
                : "Não há hábitos previstos para esta data.",
            isToday ? { label: "Criar hábito", onClick: () => navigate("/habits?new=1") } : undefined
        );
        return;
    }

    const progressCard = document.createElement("div");
    progressCard.className = "progress-card";
    const progressLabel = document.createElement("div");
    progressLabel.className = "progress-copy";
    const progressText = document.createElement("strong");
    const progressHint = document.createElement("span");
    progressLabel.append(progressText, progressHint);
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    bar.appendChild(fill);
    progressCard.append(progressLabel, bar);
    content.appendChild(progressCard);

    const list = document.createElement("ul");
    list.className = "dashboard-habit-list";

    const updateProgress = () => {
        const done = habits.filter(habit => records.get(habit.id)?.habitState === "Completed").length;
        const ratio = habits.length === 0 ? 0 : done / habits.length;
        progressText.textContent = `${done} de ${habits.length} concluídos`;
        fill.style.width = `${Math.round(ratio * 100)}%`;
        if (done === habits.length) {
            progressHint.textContent = isToday ? "Dia completo. Bom trabalho." : "Tudo concluído neste dia.";
        } else {
            progressHint.textContent = `${habits.length - done} por fazer`;
        }
    };

    habits.forEach(habit => list.appendChild(createHabitItem(habit, date, records, updateProgress)));
    content.appendChild(list);
    updateProgress();
}

function createHabitItem(
    habit: Habit,
    date: string,
    records: Map<number, HabitRecord>,
    onChange: () => void
): HTMLLIElement {
    const record = records.get(habit.id);
    const isCompleted = record?.habitState === "Completed";
    const item = document.createElement("li");
    item.className = isCompleted ? "dashboard-habit completed" : "dashboard-habit";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.id = `habit-${habit.id}`;
    checkbox.setAttribute("aria-label", `Marcar ${habit.name} como concluído`);

    const mark = document.createElement("span");
    mark.className = "check-mark";
    mark.innerHTML = iconSvg("check");

    const body = document.createElement("div");
    body.className = "dashboard-habit-body";
    const name = document.createElement("span");
    name.className = "dashboard-habit-name";
    name.textContent = habit.name;

    const meta = document.createElement("div");
    meta.className = "habit-meta";
    const priority = document.createElement("span");
    priority.className = `habit-priority priority-${habit.habitPriority.toLowerCase()}`;
    priority.textContent = priorityLabels[habit.habitPriority];
    meta.appendChild(priority);
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
        description.textContent = habit.description;
        body.appendChild(description);
    }

    const label = document.createElement("label");
    label.className = "dashboard-habit-label";
    label.htmlFor = checkbox.id;
    label.append(checkbox, mark, body);
    item.appendChild(label);

    checkbox.addEventListener("change", async () => {
        const wanted = checkbox.checked;
        const previous = records.get(habit.id);
        records.set(habit.id, {
            id: previous?.id ?? -habit.id,
            habitId: habit.id,
            habitState: wanted ? "Completed" : "Pending",
            recordDate: date,
            description: previous?.description ?? null
        });
        item.classList.toggle("completed", wanted);
        onChange();
        checkbox.disabled = true;
        try {
            const updatedRecord = await saveHabitCompletion(habit.id, date, wanted, previous);
            records.set(habit.id, updatedRecord);
            if (!wanted) {
                showToast("Hábito desmarcado.", {
                    label: "Anular",
                    onClick: () => {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event("change"));
                    }
                });
            }
        } catch {
            if (previous) records.set(habit.id, previous);
            else records.delete(habit.id);
            checkbox.checked = !wanted;
            item.classList.toggle("completed", !wanted);
            onChange();
            showToast("Não foi possível guardar o estado do hábito.");
        } finally {
            checkbox.disabled = false;
        }
    });

    return item;
}

function navButton(label: string, icon: "chevronLeft" | "chevronRight"): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-button secondary";
    button.setAttribute("aria-label", label);
    button.innerHTML = iconSvg(icon);
    return button;
}

function formatLongDate(date: string): string {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}
