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
    .map((membership) =>
      Array.isArray(membership.classes)
        ? membership.classes[0]
        : membership.classes
    )
    .filter(Boolean) as {
    id: string;
    name: string;
    period: string | null;
    accent_color: string;
  }[];

  return (
    <div className="min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <header className="page-container flex items-center justify-between gap-4 pt-7 pb-3 sm:pt-10">
        <h1 className="font-serif text-3xl text-ink">Classes</h1>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/onboarding?intent=join"
            className="inline-flex min-h-11 items-center text-sm text-ink underline underline-offset-2"
          >
            Join
          </Link>
          <Link
            href="/classes/new"
            className="inline-flex min-h-11 items-center text-sm text-ink underline underline-offset-2"
          >
            + New
          </Link>
        </div>
      </header>

      <main className="page-container">
        {classes.length === 0 ? (
          <EmptyState
            title="No classes yet"
            body="Create a class or join one with an invite link."
          >
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
              {classes.map((cls, index) => (
                <div
                  key={cls.id}
                  className="card flex min-w-0 items-center gap-3"
                >
                  <Link
                    href={`/classes/${cls.id}`}
                    className="flex min-h-11 min-w-0 flex-1 items-center gap-3"
                  >
                    <ColorDot colorId={cls.accent_color} size={10} />
                    <div className="min-w-0">
                      <p className="truncate text-[15px]">{cls.name}</p>
                      {cls.period && (
                        <p className="text-xs text-muted">
                          Period {cls.period}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="flex shrink-0 items-center">
                    <form action={reorderClass.bind(null, cls.id, "up")}>
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label={`Move ${cls.name} up`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-faint transition-colors hover:bg-wash hover:text-ink disabled:opacity-30"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={reorderClass.bind(null, cls.id, "down")}>
                      <button
                        type="submit"
                        disabled={index === classes.length - 1}
                        aria-label={`Move ${cls.name} down`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-faint transition-colors hover:bg-wash hover:text-ink disabled:opacity-30"
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
