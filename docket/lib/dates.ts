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

export function isoDateForNextWeekday(weekday: number): string {
  const d = startOfDay(new Date());
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  return d.toISOString().slice(0, 10);
}

export function relativeDueLabel(isoDate: string, completed = false): string {
  const today = startOfDay(new Date());
  const due = startOfDay(new Date(isoDate + "T00:00:00"));
  const diffDays = Math.round((due.getTime() - today.getTime()) / DAY_MS);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) {
    if (completed) {
      return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return `${Math.abs(diffDays)} days overdue`;
  }
  if (diffDays > 1 && diffDays < 7) {
    const weekday = due.toLocaleDateString("en-US", { weekday: "long" });
    const daysLeftInWeek = 6 - ((today.getDay() + 6) % 7
