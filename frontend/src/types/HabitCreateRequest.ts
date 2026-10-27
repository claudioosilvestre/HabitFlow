import type { HabitPriority } from "./HabitPriority";
import type { WeekDay } from "./Habit";

export interface HabitCreateRequest {
    name : string;
    duration : string | null;
    habitPriority : HabitPriority;
    startDate : string;
    endDate : string | null;
    description : string | null;
    daysOfWeek: WeekDay[];
}
