import type { Habit, WeekDay } from "../types/Habit";

const WEEKDAYS: WeekDay[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(date: string, amount: number): string {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return toDateString(new Date(year, month - 1, day + amount));
}

export function weekdayOf(date: string): WeekDay | undefined {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return WEEKDAYS[new Date(year, month - 1, day).getDay()];
}

export function isActiveOnDate(habit: Habit, date: string): boolean {
    return habit.startDate.slice(0, 10) <= date && (!habit.endDate || habit.endDate.slice(0, 10) >= date);
}

export function isScheduledOn(habit: Habit, date: string): boolean {
    const weekday = weekdayOf(date);
    return weekday !== undefined && habit.daysOfWeek.includes(weekday);
}

export function isDueOnDate(habit: Habit, date: string): boolean {
    return isActiveOnDate(habit, date) && isScheduledOn(habit, date);
}
