"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClass(input: {
  name: string;
  period?: string;
  teacher?: string;
  accentColor: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_class", {
    p_name: input.name.trim(),
    p_period: input.period?.trim() || "",
    p_teacher: input.teacher?.trim() || "",
    p_accent_color: input.accentColor,
  });
  const newClass = data as { id: string } | null;

  if (error || !newClass) throw new Error("Couldn't create that class. Try again.");

  revalidatePath("/dashboard");
  revalidatePath("/classes");
  redirect(`/classes/${newClass.id}?invite=1`);
}

export async function joinClassByCode(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("join_class_by_code", {
    p_code: code.trim(),
  });
  const joinedClass = data as { id: string } | null;

  if (error || !joinedClass) {
    throw new Error("This invite link isn't valid.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/classes");
  redirect(`/classes/${joinedClass.id}`);
}

export async function updateClass(input: {
  classId: string;
  name: string;
  period?: string;
  teacher?: string;
  accentColor: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("classes")
    .update({
      name: input.name.trim(),
      period: input.period?.trim() || null,
      teacher: input.teacher?.trim() || null,
      accent_color: input.accentColor,
    })
    .eq("id", input.classId);

  if (error) throw new Error("Couldn't save those changes. Try again.");

  revalidatePath("/dashboard");
  revalidatePath("/classes");
  revalidatePath(`/classes/${input.classId}`);
}

export async function leaveClass(classId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("leave_class", { p_class_id: classId });

  if (error) throw new Error("Couldn't leave that class. Try again.");

  revalidatePath("/dashboard");
  revalidatePath("/classes");
  redirect("/classes");
}