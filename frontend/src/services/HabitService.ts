import type { Habit } from "../types/Habit";
import type { HabitCreateRequest } from "../types/HabitCreateRequest";

const url = "http://localhost:5089/api/habits";

export async function getHabits() : Promise<Habit[]> {
    
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error("Failed to get habits.");
    }

    const data = await response.json() as Habit[];

    return data;
}

export async function createHabit (request:HabitCreateRequest) : Promise<Habit> {
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if(!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        throw new Error(`Failed to create habit: ${response.status} - ${errorDetails?.title || response.statusText}`);
    }

    const data = await response.json() as Habit;

    return data;
}