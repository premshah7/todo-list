import { differenceInDays, differenceInHours, differenceInMinutes, isPast, isToday, isTomorrow, formatDistanceToNow } from "date-fns"

export interface TimeStatus {
    label: string
    isOverdue: boolean
    isDueSoon: boolean // Within 24 hours
    colorClass: string
}

export function getTimeStatus(dueDate: Date | null | undefined): TimeStatus {
    if (!dueDate) {
        return {
            label: "No Due Date",
            isOverdue: false,
            isDueSoon: false,
            colorClass: "text-muted-foreground"
        }
    }

    const now = new Date()
    const overdue = isPast(dueDate) && !isToday(dueDate) // Past and not today (assuming end of day check or exact time)
    // Actually simplicity: if due date is < now, it's overdue.
    const isOver = new Date(dueDate) < now

    if (isOver) {
        return {
            label: `Overdue by ${formatDistanceToNow(dueDate)}`,
            isOverdue: true,
            isDueSoon: false,
            colorClass: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
        }
    }

    const hours = differenceInHours(dueDate, now)

    if (hours < 24) {
        return {
            label: `Due in ${formatDistanceToNow(dueDate)}`,
            isOverdue: false,
            isDueSoon: true,
            colorClass: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
        }
    }

    if (isToday(dueDate)) {
        return {
            label: "Due Today",
            isOverdue: false,
            isDueSoon: true,
            colorClass: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
        }
    }

    return {
        label: `Due in ${differenceInDays(dueDate, now)} days`,
        isOverdue: false,
        isDueSoon: false,
        colorClass: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
    }
}
