import type { HabitPriority } from "./HabitPriority";

export interface HabitCreateRequest {
    name : string;
    duration : string | null;
    habitPriority : HabitPriority;
    startDate : string;
    endDate : string | null;
    description : string | null;
}