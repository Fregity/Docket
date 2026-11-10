const DAY_MS = 24 * 60 * 60 * 1000;

function localISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateOrdinal(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
}

function addDays(iso: string, amount: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}

function weekday(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function dateForDisplay(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

export function todayISO(): string {
  return localISODate(new Date());
}

export function isoDateFromOffset(daysFromToday: number): string {
  return addDays(todayISO(), daysFromToday);
}

export function isoDateForNextWeekday(day: number): string {
  const today = todayISO();
  const diff = (day - weekday(today) + 7) % 7;
  return addDays(today, diff === 0 ? 7 : diff);
}

export function relativeDueLabel(isoDate: string, completed = false): string {
  const today = todayISO();
  const diffDays = dateOrdinal(isoDate) - dateOrdinal(today);
  const due = dateForDisplay(isoDate);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  if (diffDays < 0) {
    if (completed) {
      return due.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    }
    return `${Math.abs(diffDays)} days overdue`;
  }

  if (diffDays > 1 && diffDays < 7) {
    const dayName = due.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
    const daysLeftInWeek = 6 - ((weekday(today) + 6) % 7);
    return diffDays > daysLeftInWeek ? `Next ${dayName}` : dayName;
  }

  return due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type DueBucket =
  | "overdue"
  | "today"
  | "tomorrow"
  | "week"
  | "nextweek"
  | "later";

export function bucketForDate(isoDate: string): DueBucket {
  const today = todayISO();
  const diffDays = dateOrdinal(isoDate) - dateOrdinal(today);
  const weekEnd = 6 - ((weekday(today) + 6) % 7);

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays <= weekEnd) return "week";
  if (diffDays <= weekEnd + 7) return "nextweek";
  return "later";
}

export function nextOccurrenceOfWeekday(
  day: number,
  fromISODate: string
): string {
  const diff = (day - weekday(fromISODate) + 7) % 7;
  return addDays(fromISODate, diff);
}

export const BUCKET_LABELS: Record<DueBucket, string> = {
  overdue: "Overdue",
  today: "Today",
  tomorrow: "Tomorrow",
  week: "This week",
  nextweek: "Next week",
  later: "Later",
};

export function formatWhen(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}