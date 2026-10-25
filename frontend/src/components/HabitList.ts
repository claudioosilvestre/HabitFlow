import type { Habit } from "../types/Habit";

export function listHabits(element : HTMLElement, habits : Habit[]) : void {

    element.innerHTML ="";

    const list = document.createElement("ul");

    habits.forEach(habit => {
        
        const line = document.createElement("li");
        
        line.textContent = habit.name;

        list.appendChild(line);
    }) 

    element.appendChild(list);        
}