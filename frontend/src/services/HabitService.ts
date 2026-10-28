import type { Habit } from "../types/Habit";
import type { HabitCreateRequest } from "../types/HabitCreateRequest";

const url = "http://localhost:5089/api/habits";

async function readError(response: Response, fallback: string): Promise<Error> {
    const errorDetails = await response.json().catch(() => null) as { title?: string; detail?: string } | null;
    return new Error(`${fallback}: ${response.status} - ${errorDetails?.detail || errorDetails?.title || response.statusText}`);
}

export async function getHabits(): Promise<Habit[]> {
    const response = await fetch(url);
    if (!response.ok) throw await readError(response, "Failed to get habits");
    return await response.json() as Habit[];
}

export async function createHabit(request: HabitCreateRequest): Promise<Habit> {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });
    if (!response.ok) throw await readError(response, "Failed to create habit");
    return await response.json() as Habit;
}

export async function updateHabit(id: number, request: HabitCreateRequest): Promise<Habit> {
    const response = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });
    if (!response.ok) throw await readError(response, "Failed to update habit");
    return await response.json() as Habit;
}

export async function deleteHabit(id: number): Promise<void> {
    const response = await fetch(`${url}/${id}`, { method: "DELETE" });
    if (!response.ok) throw await readError(response, "Failed to delete habit");
}
