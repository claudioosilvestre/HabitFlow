import { listHabits } from "../components/HabitList";
import { habitForm } from "../components/HabitForm";
import { createHabit, deleteHabit, getHabits, updateHabit } from "../services/HabitService";
import type { Habit } from "../types/Habit";
import { iconSvg } from "../lib/icons";
import { replaceUrl } from "../lib/router";
import { confirmAction, openModal } from "../ui/overlay";
import { renderEmptyState, renderErrorState, renderSkeleton } from "../ui/feedback";
import { showToast } from "../ui/toast";
import { compareHabits, habitStatus } from "../utils/habits";

type FilterId = "all" | "active" | "upcoming" | "ended";

export async function habitsPage(element: HTMLElement, params: URLSearchParams): Promise<void> {
    element.innerHTML = "";

    const toolbar = document.createElement("div");
    toolbar.className = "page-toolbar";

    const filters = document.createElement("div");
    filters.className = "chip-row";
    filters.setAttribute("role", "tablist");
    filters.setAttribute("aria-label", "Filtrar hábitos");

    let currentFilter: FilterId = "all";
    const filterButtons = new Map<FilterId, HTMLButtonElement>();
    ([["all", "Todos"], ["active", "Ativos"], ["upcoming", "A começar"], ["ended", "Terminados"]] as const).forEach(([id, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `chip${id === "all" ? " active" : ""}`;
        button.textContent = label;
        button.addEventListener("click", () => {
            currentFilter = id;
            filterButtons.forEach((item, key) => item.classList.toggle("active", key === id));
            void refresh();
        });
        filterButtons.set(id, button);
        filters.appendChild(button);
    });

    const createButton = document.createElement("button");
    createButton.type = "button";
    createButton.className = "primary-with-icon";
    createButton.innerHTML = `${iconSvg("plus")} Novo hábito`;
    createButton.addEventListener("click", () => openCreate());

    toolbar.append(filters, createButton);

    const listHost = document.createElement("div");
    element.append(toolbar, listHost);
    renderSkeleton(listHost, 5);

    async function refresh(): Promise<void> {
        const habits = (await getHabits()).slice().sort(compareHabits);
        const visible = habits.filter(habit => currentFilter === "all" || habitStatus(habit) === currentFilter);

        if (habits.length === 0) {
            renderEmptyState(
                listHost,
                "Ainda não tens hábitos",
                "Cria o primeiro para começar a acompanhar o teu dia.",
                { label: "Criar hábito", onClick: () => openCreate() }
            );
            return;
        }

        if (visible.length === 0) {
            renderEmptyState(listHost, "Nada neste filtro", "Não há hábitos com este estado.");
            return;
        }

        const listWrap = document.createElement("div");
        listHabits(listWrap, visible, (habit) => openEdit(habit), (habit) => void removeHabit(habit));
        listHost.replaceChildren(listWrap);
    }

    function openCreate(): void {
        const modal = openModal("Novo hábito");
        habitForm(modal.body, async (request) => {
            await createHabit(request);
            modal.close();
            showToast("Hábito criado.");
            await refresh();
        });
    }

    function openEdit(habit: Habit): void {
        const modal = openModal("Editar hábito");
        habitForm(modal.body, async (request) => {
            await updateHabit(habit.id, request);
            modal.close();
            showToast("Hábito atualizado.");
            await refresh();
        }, habit);
    }

    async function removeHabit(habit: Habit): Promise<void> {
        const confirmed = await confirmAction({
            title: "Apagar hábito",
            message: `Apagar “${habit.name}”? Esta ação não pode ser desfeita.`,
            confirmLabel: "Apagar",
            danger: true
        });
        if (!confirmed) return;
        try {
            await deleteHabit(habit.id);
            showToast("Hábito apagado.");
            await refresh();
        } catch {
            showToast("Não foi possível apagar o hábito.");
        }
    }

    try {
        await refresh();
        if (params.get("new") === "1") {
            replaceUrl("/habits");
            openCreate();
        }
    } catch {
        renderErrorState(listHost, "Confirma se a API está disponível e tenta novamente.", () => {
            void habitsPage(element, new URLSearchParams());
        });
    }
}
