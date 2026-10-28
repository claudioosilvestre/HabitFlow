import type { Habit } from "../types/Habit";

export function listHabits(element : HTMLElement, habits : Habit[]) : void {

    element.innerHTML ="";

    const list = document.createElement("ul");

    habits.forEach(habit => {
        
        const line = document.createElement("li");
        
        const name = document.createElement("strong");
        name.textContent = habit.name;
        const schedule = document.createElement("span");
        schedule.className = "habit-schedule";
        const labels: Record<string, string> = { Monday: "Seg", Tuesday: "Ter", Wednesday: "Qua", Thursday: "Qui", Friday: "Sex", Saturday: "Sáb", Sunday: "Dom" };
        schedule.textContent = habit.daysOfWeek.map(day => labels[day]).join(" · ");
        line.append(name, schedule);

        list.appendChild(line);
    }) 

    element.appendChild(list);        
}
