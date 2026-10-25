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
}