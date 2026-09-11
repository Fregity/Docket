"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateDisplayName(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: name.trim() })
    .eq("id", user.id);

  if (error) throw new Error("Couldn't save your name. Try again.");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
