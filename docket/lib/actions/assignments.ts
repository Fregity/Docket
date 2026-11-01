"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { nextOccurrenceOfWeekday } from "@/lib/dates";

type AssignmentInsert = {
  class_id: string;
  title: string;
  description: string | null;
  due_date: string;
  recurrence_interval_weeks: number | null;
  recurrence_monthly: boolean;
  created_by: string;
};

export async function addAssignment(input: {
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
  recurringDays?: number[];
  recurringIntervalWeeks?: number;
  recurringMonthly?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  const title = input.title.trim();
  const description = input.description?.trim() || null;

  let rows: AssignmentInsert[];

  if (input.recurringMonthly) {
    rows = [
      {
        class_id: input.classId,
        title,
        description,
        due_date: input.dueDate,
        recurrence_interval_weeks: null,
        recurrence_monthly: true,
        created_by: user.id,
      },
    ];
  } else if (input.recurringDays && input.recurringDays.length > 0) {
    rows = input.recurringDays.map((day) => ({
      class_id: input.classId,
      title,
      description,
      due_date: nextOccurrenceOfWeekday(day, input.dueDate),
      recurrence_interval_weeks: input.recurringIntervalWeeks ?? 1,
      recurrence_monthly: false,
      created_by: user.id,
    }));
  } else {
    rows = [
      {
        class_id: input.classId,
        title,
        description,
        due_date: input.dueDate,
        recurrence_interval_weeks: null,
        recurrence_monthly: false,
        created_by: user.id,
      },
    ];
  }

  const { error } = await supabase.from("assignments").insert(rows);

  if (error) throw new Error("Couldn't save that assignment. Try again.");
  const { error: analyticsError } = await supabase
  .from("analytics_events")
  .insert({ event_name: "assignment_created" });

  if (analyticsError) {
    console.error("Failed to track assignment_created:", analyticsError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}

export async function updateAssignment(input: {
  id: string;
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
  /** Only sent when the person changed the repeat settings. Both are
   * applied to the whole series this assignment belongs to, so they change
   * what gets created next. recurrenceMonthly: true means monthly (and the
   * weekly interval is cleared); recurrenceIntervalWeeks: a number means
   * weekly; null with monthly false means stop repeating. */
  recurrenceIntervalWeeks?: number | null;
  recurrenceMonthly?: boolean;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      due_date: input.dueDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("series_id")
    .single();

  const updated = data as { series_id: string } | null;
  if (error || !updated) throw new Error("Couldn't save that change. Try again.");

  if (input.recurrenceIntervalWeeks !== undefined || input.recurrenceMonthly !== undefined) {
    const monthly = input.recurrenceMonthly === true;
    const { error: seriesError } = await supabase
      .from("assignments")
      .update({
        recurrence_interval_weeks: monthly ? null : input.recurrenceIntervalWeeks ?? null,
        recurrence_monthly: monthly,
      })
      .eq("series_id", updated.series_id);
    if (seriesError) throw new Error("Couldn't save that change. Try again.");
  }

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}

export async function toggleAssignmentComplete(input: {
  id: string;
  classId: string;
  completed: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  if (input.completed) {
    const { error } = await supabase
      .from("assignment_completions")
      .upsert(
        { assignment_id: input.id, user_id: user.id },
        { onConflict: "assignment_id,user_id", ignoreDuplicates: true }
      );
    if (error) throw new Error("Couldn't update that assignment. Try again.");
  } else {
    const { error } = await supabase
      .from("assignment_completions")
      .delete()
      .eq("assignment_id", input.id)
      .eq("user_id", user.id);
    if (error) throw new Error("Couldn't update that assignment. Try again.");
  }
  if (input.completed) {
  const { error: analyticsError } = await supabase
    .from("analytics_events")
    .insert({ event_name: "assignment_completed" });

    if (analyticsError) {
      console.error("Failed to track assignment_completed:", analyticsError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
  revalidatePath("/history");
}

export async function deleteAssignment(input: { id: string; classId: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("assignments").delete().eq("id", input.id);

  if (error) throw new Error("Couldn't delete that assignment. Try again.");

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}
