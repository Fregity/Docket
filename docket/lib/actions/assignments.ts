"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addAssignment(input: {
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  const { error } = await supabase.from("assignments").insert({
    class_id: input.classId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    due_date: input.dueDate,
    created_by: user.id,
  });

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

  const { error } = await supabase
    .from("assignments")
    .update({ completed: input.completed, updated_at: new Date().toISOString() })
    .eq("id", input.id);

  if (error) throw new Error("Couldn't update that assignment. Try again.");

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}

export async function deleteAssignment(input: { id: string; classId: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("assignments").delete().eq("id", input.id);

  if (error) throw new Error("Couldn't delete that assignment. Try again.");

  revalidatePath("/dashboard");
  revalidatePath(`/classes/${input.classId}`);
}
