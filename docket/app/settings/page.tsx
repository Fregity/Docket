import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut, updateDisplayName } from "@/lib/actions/account";
import { NavBar } from "@/components/NavBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import InstallButton from "@/components/InstallButton";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    !!user.email && adminEmails.includes(user.email.toLowerCase());

  async function saveName(formData: FormData) {
    "use server";

    const name = formData.get("name");

    if (typeof name === "string" && name.trim()) {
      await updateDisplayName(name);
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-28">
      <header className="mx-auto max-w-md px-5 pb-5 pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account and preferences.
        </p>
      </header>

      <main className="mx-auto flex max-w-md flex-col gap-4 px-5">
        <section className="rounded-2xl border border-hairline bg-paper p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">
            Account
          </h2>

          <form action={saveName} className="flex flex-col">
            <label className="label" htmlFor="display-name">
              Display name
            </label>
            <input
              id="display-name"
              className="input"
              name="name"
              defaultValue={profile?.display_name ?? ""}
              required
            />
            <button type="submit" className="btn-secondary mt-3 self-start">
              Save name
            </button>
          </form>

          <div className="mt-5 border-t border-hairline pt-4">
            <p className="label">Email address</p>
            <p className="break-all text-sm font-medium text-ink">
              {user.email}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-paper p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">
            Appearance
          </h2>
          <ThemeToggle />
        </section>

        <section className="rounded-2xl border border-hairline bg-paper p-5">
          <PushNotificationSettings />
        </section>

        <InstallButton />

        {isAdmin && (
          <section className="rounded-2xl border border-hairline bg-paper p-5">
            <p className="text-sm font-semibold text-ink">
              Administration
            </p>
            <p className="mt-1 text-sm text-muted">
              Internal DueBird analytics and platform statistics.
            </p>
            <Link
              href="/admin"
              className="btn-secondary mt-4 flex w-full justify-between"
            >
              <span>View admin dashboard</span>
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        )}

        <section className="rounded-2xl border border-hairline bg-paper p-4">
          <form action={signOut}>
            <button type="submit" className="btn-ghost w-full justify-start">
              Sign out
            </button>
          </form>
        </section>

        <DeleteAccountButton />
      </main>

      <NavBar />
    </div>
  );
}
