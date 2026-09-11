const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function todayISO(): string {
  return startOfDay(new Date()).toISOString().slice(0, 10);
}

export function isoDateFromOffset(daysFromToday: number): string {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

/** Next occurrence (today counts) of a given weekday, 0=Sunday..6=Saturday. */
export function isoDateForNextWeekday(weekday: number): string {
  const d = startOfDay(new Date());
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  return d.toISOString().slice(0, 10);
}

/** Renders a due date the way a student would say it: Today, Tomorrow,
 * Friday, or an absolute "Sep 18" once it's far enough out. */
export function relativeDueLabel(isoDate: string): string {
  const today = startOfDay(new Date());
  const due = startOfDay(new Date(isoDate + "T00:00:00"));
  const diffDays = Math.round((due.getTime() - today.getTime()) / DAY_MS);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays > 1 && diffDays < 7) {
    return due.toLocaleDateString("en-US", { weekday: "long" });
  }
  return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type DueBucket = "overdue" | "today" | "tomorrow" | "week" | "later";

export function bucketForDate(isoDate: string): DueBucket {
  const today = startOfDay(new Date());
  const due = startOfDay(new Date(isoDate + "T00:00:00"));
  const diffDays = Math.round((due.getTime() - today.getTime()) / DAY_MS);

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays <= 7) return "week";
  return "later";
}

export const BUCKET_LABELS: Record<DueBucket, string> = {
  overdue: "Overdue",
  today: "Today",
  tomorrow: "Tomorrow",
  week: "This week",
  later: "Later",
};

export function formatWhen(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
