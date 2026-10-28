import type { Habit } from "../types/Habit";
import { priorityRank } from "../lib/labels";
import { toDateString } from "./dates";

export type HabitStatus = "upcoming" | "active" | "ended";

export function habitStatus(habit: Habit, today = toDateString(new Date())): HabitStatus {
    const start = habit.startDate.slice(0, 10);
    const end = habit.endDate?.slice(0, 10);
    if (start > today) return "upcoming";
    if (end && end < today) return "ended";
    return "active";
}

export function formatDuration(duration: string | null): string | null {
    if (!duration) return null;
    const [hours, minutes] = duration.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
}

export function formatDateLabel(date: string): string {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

export function formatDateRange(habit: Habit): string {
    const start = formatDateLabel(habit.startDate.slice(0, 10));
    if (!habit.endDate) return `Desde ${start}`;
    return `${start} – ${formatDateLabel(habit.endDate.slice(0, 10))}`;
}

export function compareHabits(a: Habit, b: Habit, today = toDateString(new Date())): number {
    const statusRank = { active: 0, upcoming: 1, ended: 2 };
    const statusDiff = statusRank[habitStatus(a, today)] - statusRank[habitStatus(b, today)];
    if (statusDiff !== 0) return statusDiff;
    const priorityDiff = priorityRank[a.habitPriority] - priorityRank[b.habitPriority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.name.localeCompare(b.name, "pt");
}

export function greeting(now = new Date()): string {
    const hour = now.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 19) return "Boa tarde";
    return "Boa noite";
}
