import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { reorderClass } from "@/lib/actions/classes";
import { AddHomeworkModal } from "@/components/AddHomeworkModal";
import { ColorDot, EmptyState } from "@/components/ui";
import { NavBar } from "@/components/NavBar";
import { Greeting } from "@/components/Greeting";
import TrackPageView from "@/components/TrackPageView";
import { DashboardAssignments } from "@/components/DashboardAssignments";
import { DashboardInstallPrompt } from "@/components/DashboardInstallPrompt";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";
import { DashboardOnboarding } from "@/components/DashboardOnboarding";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_completed")
    .eq("id", user.id)
    .single();

  const { data: memberships } = await supabase
    .from("class_members")
    .select("classes(id, name, accent_color), position")
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
    accent_color: string;
  }[];

  const classIds = classes.map((cls) => cls.id);
  let assignmentCount = 0;

  if (classIds.length > 0) {
    const { count } = await supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .in("class_id", classIds)
      .eq("created_by", user.id);

    assignmentCount = count ?? 0;
  }

  let assignments: {
    id: string;
    class_id: string;
    title: string;
    description: string | null;
    due_date: string;
    completed: boolean;
    created_by_name: string;
    recurrence_interval_weeks: number | null;
    recurrence_monthly: boolean;
    className: string;
    accentColor: string;
  }[] = [];

  if (classIds.length > 0) {
    const { data } = await supabase
      .from("assignments_with_completion")
      .select(
        "id, class_id, title, description, due_date, completed_for_me, recurrence_interval_weeks, recurrence_monthly, classes(name, accent_color), profiles(display_name)"
      )
      .in("class_id", classIds)
      .eq("completed_for_me", false)
      .order("due_date", { ascending: true });

    assignments = (data ?? []).map((assignment: any) => ({
      id: assignment.id,
      class_id: assignment.class_id,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      completed: assignment.completed_for_me,
      recurrence_interval_weeks: assignment.recurrence_interval_weeks,
      recurrence_monthly: assignment.recurrence_monthly,
      created_by_name: assignment.profiles?.display_name ?? "Someone",
      className: assignment.classes?.name ?? "",
      accentColor: assignment.classes?.accent_color ?? "olive",
    }));
  }

  const firstName = (profile?.display_name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))]">
      <TrackPageView eventName="dashboard_returned" />

      <header className="page-container pt-7 pb-4 sm:pt-10">
        <Greeting firstName={firstName} />
        {profile?.onboarding_completed !== false && (
          <>
            <PushNotificationSettings variant="dashboard" />
            <DashboardInstallPrompt />
          </>
        )}
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
            {assignments.length === 0 ? (
              <p className="py-8 text-center text-[15px] text-muted">
                Nothing due — you&rsquo;re all caught up.
              </p>
            ) : (
              <DashboardAssignments
                assignments={assignments}
                editableClasses={classes}
              />
            )}

            <div className="mb-3 mt-8 flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg text-ink">My classes</h3>
              <Link
                href="/onboarding?intent=join"
                className="min-h-11 inline-flex items-center text-sm text-muted underline underline-offset-2"
              >
                Join a class
              </Link>
            </div>

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
                    <span className="truncate text-[15px]">{cls.name}</span>
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
              <Link
                href="/classes/new"
                className="mt-1 inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-2"
              >
                + New class
              </Link>
            </div>
          </>
        )}
      </main>

      {classes.length > 0 && (
        <div className="fixed bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] right-4 z-30 sm:right-6">
          <AddHomeworkModal classes={classes} />
        </div>
      )}

      <NavBar />
      {profile?.onboarding_completed === false && (
        <DashboardOnboarding
          classes={classes}
          hasAssignments={assignmentCount > 0}
        />
      )}
    </div>
  );
}
