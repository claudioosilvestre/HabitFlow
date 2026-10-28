import { dayOptions } from "../labels";
import type { Habit, WeekDay } from "../types/Habit";
import type { HabitCreateRequest } from "../types/HabitCreateRequest";
import { HabitPriority } from "../types/HabitPriority";
import { showToast } from "../ui/toast";

export function habitForm(
    element: HTMLElement,
    onSubmit: (habitCreate: HabitCreateRequest) => Promise<void>,
    habit?: Habit
): HTMLFormElement {
    const form = document.createElement("form");
    form.className = "habit-form";

    const nameInput = textInput("name", "Nome", "text", true, 100);
    nameInput.input.value = habit?.name ?? "";

    const hoursDurationInput = numberInput("hoursDuration", "Horas", 0);
    const minutesDurationInput = numberInput("minutesDuration", "Minutos", 0, 59);
    const durationParts = parseDuration(habit?.duration);
    if (durationParts) {
        hoursDurationInput.value = String(durationParts.hours);
        minutesDurationInput.value = String(durationParts.minutes);
    }

    const durationFieldSet = document.createElement("fieldset");
    const durationLegend = document.createElement("legend");
    durationLegend.textContent = "Duração";
    durationFieldSet.append(
        durationLegend,
        labeled(hoursDurationInput, "Horas"),
        labeled(minutesDurationInput, "Minutos")
    );
    const durationGroup = group();
    durationGroup.appendChild(durationFieldSet);

    const habitPriorityInput = document.createElement("select");
    habitPriorityInput.required = true;
    habitPriorityInput.id = "priority";
    const placeholder = option("", "Seleciona uma prioridade", true);
    placeholder.disabled = true;
    habitPriorityInput.append(
        placeholder,
        option(HabitPriority.Low, "Baixa"),
        option(HabitPriority.Medium, "Média"),
        option(HabitPriority.High, "Alta"),
        option(HabitPriority.Urgent, "Urgente")
    );
    habitPriorityInput.value = habit?.habitPriority ?? "";
    const priorityGroup = labeledSelect("Prioridade", habitPriorityInput);

    const startDateInput = dateInput("startDate", "Data de início", true, habit?.startDate);
    const endDateInput = dateInput("endDate", "Data de fim", false, habit?.endDate);

    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "description";
    descriptionInput.name = "description";
    descriptionInput.maxLength = 500;
    descriptionInput.value = habit?.description ?? "";
    const descriptionGroup = labeledTextarea("Descrição", descriptionInput);

    const scheduleFieldSet = document.createElement("fieldset");
    const scheduleLegend = document.createElement("legend");
    scheduleLegend.textContent = "Dias em que se repete";
    scheduleFieldSet.appendChild(scheduleLegend);
    const dayCheckboxes: HTMLInputElement[] = [];
    dayOptions.forEach(({ value, label }) => {
        const dayLabel = document.createElement("label");
        dayLabel.className = "schedule-day";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.checked = habit ? habit.daysOfWeek.includes(value) : true;
        checkbox.setAttribute("aria-label", label);
        const dayName = document.createElement("span");
        dayName.textContent = label;
        dayLabel.append(checkbox, dayName);
        scheduleFieldSet.appendChild(dayLabel);
        dayCheckboxes.push(checkbox);
        checkbox.addEventListener("change", () => {
            if (dayCheckboxes.some(dayCheckbox => dayCheckbox.checked)) dayCheckboxes[0]?.setCustomValidity("");
        });
    });
    const scheduleGroup = group("schedule-group");
    scheduleGroup.appendChild(scheduleFieldSet);

    const actions = document.createElement("div");
    actions.className = "form-actions";
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = habit ? "Guardar alterações" : "Criar hábito";
    actions.append(submitButton);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (nameInput.input.value.trim() === "") {
            nameInput.input.setCustomValidity("O nome não pode estar vazio.");
        } else {
            nameInput.input.setCustomValidity("");
        }

        let endDateVerification: string | null = null;
        if (endDateInput.value === "") {
            endDateInput.setCustomValidity("");
        } else if (endDateInput.value < startDateInput.value) {
            endDateInput.setCustomValidity("A data de fim não pode ser anterior à data de início.");
        } else {
            endDateInput.setCustomValidity("");
            endDateVerification = endDateInput.value;
        }

        const selectedDays = dayCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value as WeekDay);
        dayCheckboxes[0]?.setCustomValidity(selectedDays.length === 0 ? "Seleciona pelo menos um dia." : "");

        if (!form.reportValidity()) return;

        let timeStringConverted: string | null = null;
        if (hoursDurationInput.value !== "" || minutesDurationInput.value !== "") {
            const totalMinutes = (Number(hoursDurationInput.value) * 60) + Number(minutesDurationInput.value);
            if (totalMinutes <= 0) {
                minutesDurationInput.setCustomValidity("A duração tem de ser positiva.");
                form.reportValidity();
                return;
            }
            minutesDurationInput.setCustomValidity("");
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            timeStringConverted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
        }

        const descriptionVerification = descriptionInput.value.trim() || null;
        const habitCreateRequest: HabitCreateRequest = {
            name: nameInput.input.value.trim(),
            duration: timeStringConverted,
            habitPriority: habitPriorityInput.value as HabitPriority,
            startDate: startDateInput.value,
            endDate: endDateVerification,
            description: descriptionVerification,
            daysOfWeek: selectedDays
        };

        submitButton.disabled = true;
        try {
            await onSubmit(habitCreateRequest);
        } catch {
            showToast(habit ? "Não foi possível atualizar o hábito." : "Não foi possível criar o hábito.");
        } finally {
            submitButton.disabled = false;
        }
    });

    form.append(
        nameInput.group,
        durationGroup,
        priorityGroup,
        labeledDate("Data de início", startDateInput),
        labeledDate("Data de fim", endDateInput),
        descriptionGroup,
        scheduleGroup,
        actions
    );

    element.replaceChildren(form);
    nameInput.input.focus();
    return form;
}

function group(className = "form-group"): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = className.includes("form-group") ? className : `form-group ${className}`;
    return wrapper;
}

function textInput(id: string, labelText: string, type: string, required: boolean, maxLength?: number) {
    const input = document.createElement("input");
    input.type = type;
    input.name = id;
    input.id = id;
    input.required = required;
    if (maxLength) input.maxLength = maxLength;
    const groupEl = document.createElement("div");
    groupEl.className = "form-group";
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;
    groupEl.append(label, input);
    return { group: groupEl, input };
}

function numberInput(id: string, ariaLabel: string, min: number, max?: number): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "number";
    input.min = String(min);
    if (max !== undefined) input.max = String(max);
    input.step = "1";
    input.id = id;
    input.setAttribute("aria-label", ariaLabel);
    return input;
}

function dateInput(id: string, ariaLabel: string, required: boolean, value?: string | null): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "date";
    input.id = id;
    input.required = required;
    input.setAttribute("aria-label", ariaLabel);
    if (value) input.value = value.slice(0, 10);
    return input;
}

function labeled(input: HTMLInputElement, text: string): HTMLLabelElement {
    const label = document.createElement("label");
    label.textContent = `${text}: `;
    label.htmlFor = input.id;
    label.appendChild(input);
    return label;
}

function labeledSelect(text: string, select: HTMLSelectElement): HTMLDivElement {
    const wrapper = group();
    const label = document.createElement("label");
    label.textContent = text;
    label.htmlFor = select.id;
    wrapper.append(label, select);
    return wrapper;
}

function labeledDate(text: string, input: HTMLInputElement): HTMLDivElement {
    const wrapper = group();
    const label = document.createElement("label");
    label.textContent = text;
    label.htmlFor = input.id;
    wrapper.append(label, input);
    return wrapper;
}

function labeledTextarea(text: string, input: HTMLTextAreaElement): HTMLDivElement {
    const wrapper = group();
    const label = document.createElement("label");
    label.textContent = text;
    label.htmlFor = input.id;
    wrapper.append(label, input);
    return wrapper;
}

function option(value: string, text: string, selected = false): HTMLOptionElement {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = text;
    item.selected = selected;
    return item;
}

function parseDuration(duration: string | null | undefined): { hours: number; minutes: number } | null {
    if (!duration) return null;
    const [hours = 0, minutes = 0] = duration.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return { hours, minutes };
}
