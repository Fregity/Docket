import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ColorDot, EmptyState, SectionLabel } from "@/components/ui";
import { AssignmentCard, type AssignmentData } from "@/components/AssignmentCard";
import { AddHomeworkModal } from "@/components/AddHomeworkModal";
import { ShareClass } from "@/components/ShareClass";
import { NavBar } from "@/components/NavBar";
import { relativeDueLabel } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ClassDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite?: string }>;
}) {
  const { id } = await params;
  const { invite } = await searchParams;
  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("id, name, period, teacher, accent_color, invite_code")
    .eq("id", id)
    .single();

  if (!cls) notFound();

  const { data: memberRows } = await supabase
    .from("class_members")
    .select("profiles(display_name)")
    .eq("class_id", id);

  const members = (memberRows ?? [])
    .map((m) => (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles))
    .filter(Boolean) as { display_name: string }[];

  const { data: assignmentRows } = await supabase
    .from("assignments")
    .select("id, class_id, title, description, due_date, completed, created_at, profiles(display_name)")
    .eq("class_id", id)
    .order("due_date", { ascending: true });

  const all: (AssignmentData & { created_at: string })[] = (assignmentRows ?? []).map((a: any) => ({
    id: a.id,
    class_id: a.class_id,
    title: a.title,
    description: a.description,
    due_date: a.due_date,
    completed: a.completed,
    created_at: a.created_at,
    created_by_name: a.profiles?.display_name ?? "Someone",
  }));

  const active = all.filter((a) => !a.completed);
  const completed = all
    .filter((a) => a.completed)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const inviteUrl = `${siteUrl}/join/${cls.invite_code}`;

  const classOption = [{ id: cls.id, name: cls.name, accent_color: cls.accent_color }];

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-10 pb-4 max-w-2xl mx-auto">
        <Link href="/classes" className="text-sm text-muted">
          ← All classes
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <ColorDot colorId={cls.accent_color} size={12} />
          <h1 className="font-serif text-3xl text-ink">{cls.name}</h1>
        </div>
        {cls.period && <p className="text-muted text-sm mt-1">Period {cls.period}</p>}

        <div className="flex gap-3 mt-5">
          <ShareClass className={cls.name} inviteUrl={inviteUrl} autoOpen={invite === "1"} />
          <AddHomeworkModal
            classes={classOption}
            lockedClassId={cls.id}
            trigger={(open) => (
              <button className="btn-primary" onClick={open}>
                + Add homework
              </button>
            )}
          />
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto">
        {active.length === 0 && completed.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            body="Add the first assignment so nobody has to ask “what was the homework?”"
          />
        ) : (
          <>
            {active.length > 0 && (
              <section>
                <SectionLabel>Due</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {active.map((a) => (
                    <AssignmentCard
                      key={a.id}
                      assignment={a}
                      accentColor={cls.accent_color}
                      editableClasses={classOption}
                    />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <SectionLabel>Completed</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {completed.map((a) => (
                    <AssignmentCard
                      key={a.id}
                      assignment={a}
                      accentColor={cls.accent_color}
                      editableClasses={classOption}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <SectionLabel>Members</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-4">
          {members.map((m, i) => (
            <span key={i} className="text-sm text-muted px-3 py-1.5 rounded-xl bg-wash">
              {m.display_name}
            </span>
          ))}
        </div>
      </main>

      <NavBar />
    </div>
  );
}
