import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, SectionLabel } from "@/components/ui";
import { ClassList } from "@/components/ClassList";
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
            <ClassList classes={classes} />
          </>
        )}
      </main>

      <NavBar />
    </div>
  );
}
