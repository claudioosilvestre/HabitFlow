import type { HabitRecord } from "../types/HabitRecord";

const url = "http://localhost:5089/api/habit-records";

export async function getHabitRecordsByDate(date: string): Promise<HabitRecord[]> {
    const response = await fetch(`${url}/by-date?date=${encodeURIComponent(date)}`);
    if (!response.ok) throw new Error("Failed to get habit records for the selected date.");
    return await response.json() as HabitRecord[];
}

export async function saveHabitCompletion(habitId: number, date: string, completed: boolean, record?: HabitRecord): Promise<HabitRecord> {
    const state = completed ? "Completed" : "Pending";

    if (record) {
        const response = await fetch(`${url}/${record.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habitState: state, recordDate: date, description: record.description })
        });
        if (!response.ok) throw new Error("Failed to update the habit record.");
        return await response.json() as HabitRecord;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, habitState: state, recordDate: date, description: null })
    });
    if (!response.ok) throw new Error("Failed to save the habit record.");
    return await response.json() as HabitRecord;
}
