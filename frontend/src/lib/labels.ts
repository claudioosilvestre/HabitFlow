import { HabitPriority } from "../types/HabitPriority";
import type { WeekDay } from "../types/Habit";

export const dayLabels: Record<WeekDay, string> = {
    Monday: "Seg",
    Tuesday: "Ter",
    Wednesday: "Qua",
    Thursday: "Qui",
    Friday: "Sex",
    Saturday: "Sáb",
    Sunday: "Dom"
};

export const dayOptions: Array<{ value: WeekDay; label: string }> = [
    { value: "Monday", label: "Seg" },
    { value: "Tuesday", label: "Ter" },
    { value: "Wednesday", label: "Qua" },
    { value: "Thursday", label: "Qui" },
    { value: "Friday", label: "Sex" },
    { value: "Saturday", label: "Sáb" },
    { value: "Sunday", label: "Dom" }
];

export const priorityLabels: Record<HabitPriority, string> = {
    [HabitPriority.Low]: "Baixa",
    [HabitPriority.Medium]: "Média",
    [HabitPriority.High]: "Alta",
    [HabitPriority.Urgent]: "Urgente"
};

export const priorityRank: Record<HabitPriority, number> = {
    [HabitPriority.Urgent]: 0,
    [HabitPriority.High]: 1,
    [HabitPriority.Medium]: 2,
    [HabitPriority.Low]: 3
};
