import { listHabits } from "./HabitList";
import { habitForm } from "./HabitForm";
import { createHabit, deleteHabit, getHabits, updateHabit } from "../services/HabitService";
import type { Habit } from "../types/Habit";

export async function habitsPage(element: HTMLElement): Promise<void> {
    element.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = "Os meus hábitos";
    element.appendChild(heading);

    const habitListDiv = document.createElement("div");
    const formHost = document.createElement("div");
    formHost.className = "habit-form-host";

    const createButton = document.createElement("button");
    createButton.type = "button";
    createButton.textContent = "Criar hábito";
    createButton.addEventListener("click", () => {
        habitForm(formHost, async (request) => {
            await createHabit(request);
            await refresh();
        });
    });

    element.append(createButton, habitListDiv, formHost);

    async function refresh(): Promise<void> {
        const habits = await getHabits();
        listHabits(habitListDiv, habits, (habit) => openEditForm(habit), (habit) => removeHabit(habit));
    }

    function openEditForm(habit: Habit): void {
        habitForm(formHost, async (request) => {
            await updateHabit(habit.id, request);
            await refresh();
        }, habit);
        formHost.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    async function removeHabit(habit: Habit): Promise<void> {
        if (!confirm(`Apagar o hábito “${habit.name}”? Esta ação não pode ser desfeita.`)) return;
        try {
            await deleteHabit(habit.id);
            await refresh();
        } catch {
            alert("Não foi possível apagar o hábito. Tenta novamente.");
        }
    }

    try {
        await refresh();
    } catch {
        const error = document.createElement("p");
        error.textContent = "Não foi possível carregar os hábitos. Confirma se a API está disponível e tenta novamente.";
        habitListDiv.replaceChildren(error);
    }
}
