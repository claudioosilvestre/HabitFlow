import type { HabitPriority } from "./HabitPriority";

export interface Habit {
    id : number;
    name : string;
    duration : string | null;
    habitPriority: HabitPriority; 
    startDate : string;
    endDate : string | null;
    createdAt : string;
    description : string | null;
    daysOfWeek: WeekDay[];
}

export type WeekDay = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
