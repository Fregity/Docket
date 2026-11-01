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

  const { error: analyticsError } = await supabase
  .from("analytics_events")
  .insert({ event_name: "class_created" });

  if (analyticsError) {
    console.error("Failed to track class_created:", analyticsError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/classes");
  redirect(`/classes/${newClass.id}?invite=1`);
}

export async function joinClassByCode(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("join_class_by_code", {
    p_code: code.trim(),
  });
  const joinedClass = data as { id: string | null } | null;

  if (error?.message.includes("too_many_attempts")) {
    throw new Error("Too many tries. Wait a little while and try again.");
  }
  if (error || !joinedClass?.id) {
    throw new Error("This invite link isn't valid.");
  }

  const { error: analyticsError } = await supabase
  .from("analytics_events")
  .insert({ event_name: "class_joined" });

  if (analyticsError) {
    console.error("Failed to track class_joined:", analyticsError.message);
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

export async function reorderClass(classId: string, direction: "up" | "down") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: memberships } = await supabase
    .from("class_members")
    .select("id, class_id, position")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (!memberships) return;

  const index = memberships.findIndex((m) => m.class_id === classId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= memberships.length) return;

  const current = memberships[index];
  const swap = memberships[swapIndex];

  await supabase.from("class_members").update({ position: swap.position }).eq("id", current.id);
  await supabase.from("class_members").update({ position: current.position }).eq("id", swap.id);

  revalidatePath("/dashboard");
  revalidatePath("/classes");
}
