import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { bucketForDate, BUCKET_LABELS, type DueBucket } from "@/lib/dates";
import { AssignmentCard, type AssignmentData } from "@/components/AssignmentCard";
import { AddHomeworkModal } from "@/components/AddHomeworkModal";
import { ColorDot, EmptyState, SectionLabel } from "@/components/ui";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  const { data: memberships } = await supabase
    .from("class_members")
    .select("classes(id, name, accent_color)")
    .eq("user_id", user.id);

  const classes = (memberships ?? [])
    .map((m) => (Array.isArray(m.classes) ? m.classes[0] : m.classes))
    .filter(Boolean) as { id: string; name: string; accent_color: string }[];

  const classIds = classes.map((c) => c.id);

  let assignments: (AssignmentData & { className: string; accentColor: string })[] = [];

  if (classIds.length > 0) {
    const { data } = await supabase
      .from("assignments")
      .select("id, class_id, title, description, due_date, completed, classes(name, accent_color), profiles(display_name)")
      .in("class_id", classIds)
      .eq("completed", false)
      .order("due_date", { ascending: true });

    assignments = (data ?? []).map((a: any) => ({
      id: a.id,
      class_id: a.class_id,
      title: a.title,
      description: a.description,
      due_date: a.due_date,
      completed: a.completed,
      created_by_name: a.profiles?.display_name ?? "Someone",
      className: a.classes?.name ?? "",
      accentColor: a.classes?.accent_color ?? "olive",
    }));
  }

  const buckets: DueBucket[] = ["overdue", "today", "tomorrow", "week", "later"];
  const grouped = buckets.map((b) => ({
    bucket: b,
    items: assignments.filter((a) => bucketForDate(a.due_date) === b),
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (profile?.display_name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-10 pb-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink">
          {greeting}, {firstName}
        </h1>
      </header>

      <main className="px-6 max-w-2xl mx-auto">
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
            {assignments.length === 0 && (
              <p className="text-muted text-[15px] py-8 text-center">
                Nothing due — you&rsquo;re all caught up.
              </p>
            )}

            {grouped.map(
              ({ bucket, items }) =>
                items.length > 0 && (
                  <section key={bucket}>
                    <SectionLabel>{BUCKET_LABELS[bucket]}</SectionLabel>
                    <div className="flex flex-col gap-2.5">
                      {items.map((a) => (
                        <AssignmentCard
                          key={a.id}
                          assignment={a}
                          className={a.className}
                          accentColor={a.accentColor}
                          showClassName
                          editableClasses={classes}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}

            <SectionLabel>My classes</SectionLabel>
            <div className="flex flex-col gap-2">
              {classes.map((c) => (
                <Link
                  key={c.id}
                  href={`/classes/${c.id}`}
                  className="card flex items-center gap-3 hover:bg-wash transition-colors"
                >
                  <ColorDot colorId={c.accent_color} size={10} />
                  <span className="text-[15px]">{c.name}</span>
                </Link>
              ))}
              <Link href="/classes/new" className="text-sm text-muted underline underline-offset-2 mt-1">
                + New class
              </Link>
            </div>
          </>
        )}
      </main>

      {classes.length > 0 && (
        <div className="fixed bottom-24 sm:bottom-8 right-6">
          <AddHomeworkModal classes={classes} />
        </div>
      )}

      <NavBar />
    </div>
  );
}
