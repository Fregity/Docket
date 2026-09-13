import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { reorderClass } from "@/lib/actions/classes";
import { ColorDot, EmptyState, SectionLabel } from "@/components/ui";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("class_members")
    .select("classes(id, name, period, accent_color), position")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const classes = (memberships ?? [])
    .map((m) => (Array.isArray(m.classes) ? m.classes[0] : m.classes))
    .filter(Boolean) as { id: string; name: string; period: string | null; accent_color: string }[];

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-10 pb-2 max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Classes</h1>
        <div className="flex items-center gap-4">
          <Link href="/onboarding?intent=join" className="text-sm text-ink underline underline-offset-2">
            Join
          </Link>
          <Link href="/classes/new" className="text-sm text-ink underline underline-offset-2">
            + New
          </Link>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto">
        {classes.length === 0 ? (
          <EmptyState title="No classes yet" body="Create a class or join one with an invite link.">
            <Link href="/classes/new" className="btn-primary">
              Create a class
            </Link>
            <Link href="/onboarding?intent=join" className="btn-secondary">
              Join a class
            </Link>
          </EmptyState>
        ) : (
          <>
            <SectionLabel>Your classes</SectionLabel>
            <div className="flex flex-col gap-2">
              {classes.map((c, idx) => (
                <div key={c.id} className="card flex items-center gap-3">
                  <Link href={`/classes/${c.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <ColorDot colorId={c.accent_color} size={10} />
                    <div className="min-w-0">
                      <p className="text-[15px] truncate">{c.name}</p>
                      {c.period && <p className="text-xs text-muted">Period {c.period}</p>}
                    </div>
                  </Link>
                  <div className="flex flex-col shrink-0">
                    <form action={reorderClass.bind(null, c.id, "up")}>
                      <button
                        type="submit"
                        disabled={idx === 0}
                        aria-label="Move up"
                        className="block px-1.5 text-faint hover:text-ink disabled:opacity-30 disabled:hover:text-faint"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={reorderClass.bind(null, c.id, "down")}>
                      <button
                        type="submit"
                        disabled={idx === classes.length - 1}
                        aria-label="Move down"
                        className="block px-1.5 text-faint hover:text-ink disabled:opacity-30 disabled:hover:text-faint"
                      >
                        ▼
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <NavBar />
    </div>
  );
}
