import type { Habit } from "../types/Habit";

const url = "http://localhost:5089/api/habits";

export async function getHabits() : Promise<Habit[]> {
    
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error("Failed to get habits.");
    }

    const data = await response.json() as Habit[];

    return data;
}