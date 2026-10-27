export interface HabitRecord {
    id: number;
    habitId: number;
    habitState: "Pending" | "Completed" | "NotCompleted";
    recordDate: string;
    description: string | null;
}
