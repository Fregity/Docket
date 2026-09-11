import { createClient } from "@/lib/supabase/server";
import { signOut, updateDisplayName } from "@/lib/actions/account";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .single();

  async function saveName(formData: FormData) {
    "use server";
    const name = formData.get("name");
    if (typeof name === "string" && name.trim()) {
      await updateDisplayName(name);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-10 pb-4 max-w-md mx-auto">
        <h1 className="font-serif text-3xl text-ink">Settings</h1>
      </header>

      <main className="px-6 max-w-md mx-auto flex flex-col gap-8">
        <form action={saveName} className="flex flex-col gap-1.5">
          <label className="label">Display name</label>
          <input
            className="input"
            name="name"
            defaultValue={profile?.display_name ?? ""}
            required
          />
          <button type="submit" className="btn-secondary mt-2 self-start">
            Save
          </button>
        </form>

        <div>
          <label className="label">Email</label>
          <p className="text-[15px] text-ink">{profile?.email}</p>
        </div>

        <form action={signOut}>
          <button type="submit" className="btn-ghost">
            Sign out
          </button>
        </form>
      </main>

      <NavBar />
    </div>
  );
}
