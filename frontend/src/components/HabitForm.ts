import type { HabitCreateRequest } from "../types/HabitCreateRequest";
import { HabitPriority } from "../types/HabitPriority";

export function habitForm(element : HTMLElement, onCreate: (habitCreate : HabitCreateRequest) => Promise<void>) : void {

    const form = document.createElement("form");

    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group"

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name: ";
    nameLabel.htmlFor = "name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.required = true;
    nameInput.id = "name";

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    const durationGroup = document.createElement("div");
    durationGroup.className = "form-group";

    const durationFieldSet = document.createElement("fieldset");

    const durationLegend = document.createElement("legend");
    durationLegend.textContent = "Duration: ";

    const hoursLabel = document.createElement("label");
    hoursLabel.textContent = "Hours: ";
    hoursLabel.htmlFor = "hoursDuration";

    const hoursDurationInput = document.createElement("input");
    hoursDurationInput.type = "number";
    hoursDurationInput.min = "0";
    hoursDurationInput.step = "1";
    hoursDurationInput.id = "hoursDuration";

    const minutesLabel = document.createElement("label");
    minutesLabel.textContent = "Minutes: ";
    minutesLabel.htmlFor = "minutesDuration";

    const minutesDurationInput = document.createElement("input");
    minutesDurationInput.type = "number";
    minutesDurationInput.min = "0";
    minutesDurationInput.max = "59";
    minutesDurationInput.step = "1";
    minutesDurationInput.id = "minutesDuration";

    durationFieldSet.appendChild(durationLegend);
    durationFieldSet.appendChild(hoursLabel);
    durationFieldSet.appendChild(hoursDurationInput);
    durationFieldSet.appendChild(minutesLabel);
    durationFieldSet.appendChild(minutesDurationInput);
    durationGroup.appendChild(durationFieldSet);

    const priorityGroup = document.createElement("div");
    priorityGroup.className = "form-group";

    const habitPriorityLabel = document.createElement("label");
    habitPriorityLabel.textContent = "Priority: ";
    habitPriorityLabel.htmlFor = "priority";

    const habitPriorityInput = document.createElement("select");
    habitPriorityInput.required = true;
    habitPriorityInput.id = "priority";

    const standardOption = document.createElement("option");
    standardOption.value = "";
    standardOption.disabled = true;
    standardOption.selected = true;
    standardOption.textContent = "Select a priority";

    const lowOption = document.createElement("option");
    lowOption.value = "Low";
    lowOption.textContent = "Low";

    const mediumOption = document.createElement("option");
    mediumOption.value = "Medium";
    mediumOption.textContent = "Medium";

    const highOption = document.createElement("option");
    highOption.value = "High";
    highOption.textContent = "High";

    const urgentOption = document.createElement("option");
    urgentOption.value = "Urgent";
    urgentOption.textContent = "Urgent";

    habitPriorityInput.appendChild(standardOption);
    habitPriorityInput.appendChild(lowOption);
    habitPriorityInput.appendChild(mediumOption);
    habitPriorityInput.appendChild(highOption);
    habitPriorityInput.appendChild(urgentOption);

    priorityGroup.appendChild(habitPriorityLabel);
    priorityGroup.appendChild(habitPriorityInput);

    const startDateGroup = document.createElement("div");
    startDateGroup.className = "form-group";

    const startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Start Date: ";
    startDateLabel.htmlFor = "startDate";

    const startDateInput = document.createElement("input");
    startDateInput.type = "date";
    startDateInput.required = true;
    startDateInput.id = "startDate";

    startDateGroup.appendChild(startDateLabel);
    startDateGroup.appendChild(startDateInput);

    const endDateGroup = document.createElement("div");
    endDateGroup.className = "form-group";

    const endDateLabel = document.createElement("label");
    endDateLabel.textContent = "End Date: ";
    endDateLabel.htmlFor = "endDate";

    const endDateInput = document.createElement("input");
    endDateInput.type = "date";
    endDateInput.id = "endDate";

    endDateGroup.appendChild(endDateLabel);
    endDateGroup.appendChild(endDateInput);

    const descriptionGroup = document.createElement("div");
    descriptionGroup.className = "form-group";

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description: ";
    descriptionLabel.htmlFor = "description";

    const descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    descriptionInput.id = "description";

    descriptionGroup.appendChild(descriptionLabel);
    descriptionGroup.appendChild(descriptionInput);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        let endDateVerification: string | null;
        let descriptionVerification: string | null;
        let totalMinutes: number | null;
        let timeStringConverted: string | null;

        if(nameInput.value.trim() === "") {
            nameInput.setCustomValidity("Name cannot be empty.");
        } else {
            nameInput.setCustomValidity("");
        }

        if(endDateInput.value === "") {
            endDateInput.setCustomValidity("");
            endDateVerification = null;
        } else {
            if(endDateInput.value < startDateInput.value) {
                endDateInput.setCustomValidity("End date cannot be before start date.");
                endDateVerification = null;
            } else {
                endDateInput.setCustomValidity("");
                endDateVerification = endDateInput.value;
            }
        }

        if(!form.reportValidity()) {
            return;
        }
        
        if(hoursDurationInput.value === "" && minutesDurationInput.value === "") {
            totalMinutes = null;
            timeStringConverted = null;
        } else {
            totalMinutes = (Number(hoursDurationInput.value) * 60) + (Number(minutesDurationInput.value));
            const hours = (Math.floor(totalMinutes / 60));
            const minutes = totalMinutes % 60;

            timeStringConverted = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":00";
        }

        descriptionVerification = descriptionInput.value.trim();

        if(descriptionVerification === "") {
            descriptionVerification = null;
        } 

        const habitCreateRequest : HabitCreateRequest = {
            name: nameInput.value.trim(),
            duration: timeStringConverted,
            habitPriority: habitPriorityInput.value as HabitPriority,
            startDate: startDateInput.value,
            endDate: endDateVerification,
            description: descriptionVerification
        };

        try {
            await onCreate(habitCreateRequest);

            form.remove();
        } catch(error) {
            alert("Failed to create habit.");
        }
    })

    form.appendChild(nameGroup);
    form.appendChild(durationGroup);
    form.appendChild(priorityGroup);
    form.appendChild(startDateGroup);
    form.appendChild(endDateGroup);
    form.appendChild(descriptionGroup);
    form.appendChild(submitButton);

    element.appendChild(form);
}