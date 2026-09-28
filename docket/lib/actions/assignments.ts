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
  created_by: string;
};

export async function addAssignment(input: {
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
  recurringDays?: number[];
  recurringIntervalWeeks?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  const title = input.title.trim();
  const description = input.description?.trim() || null;

    const rows: AssignmentInsert[] =
    input.recurringDays && input.recurringDays.length > 0
      ? input.recurringDays.map((day) => ({
          class_id: input.classId,
          title,
          description,
          due_date: nextOccurrenceOfWeekday(day, input.dueDate),
          recurrence_interval_weeks: input.recurringIntervalWeeks ?? 1,
          created_by: user.id,
        }))
      : [
          {
            class_id: input.classId,
            title,
            description,
            due_date: input.dueDate,
            recurrence_interval_weeks: null,
            created_by: user.id,
          },
        ];

  const { error } = await supabase.from("assignments").insert(rows);

  if (error) throw new Error("Couldn't save that assignment. Try again.");

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}

export async function updateAssignment(input: {
  id: string;
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      due_date: input.dueDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) throw new Error("Couldn't save that change. Try again.");

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