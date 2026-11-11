
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface AdminStats {
  total_users: number;
  total_classes: number;
  total_assignments: number;
}

interface AdminEngagement {
  active_users_7d: number;
  active_users_30d: number;
  multi_day_returning_users: number;
}

interface AdminAnalytics {
  total_events: number;
  unique_visitors: number;
  unique_sessions: number;
  landing_views: number;
  signups: number;
  classes_created: number;
  classes_joined: number;
  assignments_created: number;
  assignments_completed: number;
  demo_starts: number;
  demo_completions: number;
  returning_visitors: number;
  d1_returned: number;
  d1_eligible: number;
  d7_returned: number;
  d7_eligible: number;
  d30_returned: number;
  d30_eligible: number;
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const allowed =
    !!user?.email && allowlist.includes(user.email.toLowerCase());

  if (!user || !allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-serif text-2xl mb-2">Private area</p>
          <p className="text-muted text-sm">
            You don&apos;t have access to this page.
          </p>
        </div>
      </main>
    );
  }

  const [countsResponse, analyticsResponse, engagementResponse] =
    await Promise.all([
      supabase.rpc("admin_counts").maybeSingle(),
      supabase.rpc("admin_analytics").maybeSingle(),
      supabase.rpc("admin_engagement_metrics").maybeSingle(),
    ]);


  if (countsResponse.error) {
    console.error("admin_counts RPC error:", countsResponse.error);
  }

  if (analyticsResponse.error) {
    console.error("admin_analytics RPC error:", analyticsResponse.error);
  }

  if (engagementResponse.error) {
    console.error(
      "admin_engagement_metrics RPC error:",
      engagementResponse.error
    );
  }

  const engagement = engagementResponse.data as AdminEngagement | null;

  const result = countsResponse.data as AdminStats | null;
  const analytics = analyticsResponse.data as AdminAnalytics | null;

  const statsAvailable = !countsResponse.error && result !== null;
  const analyticsAvailable =
    !analyticsResponse.error && analytics !== null;

  const format = (value: number | undefined) =>
    value !== undefined ? value.toLocaleString("en-US") : "—";

  const formatRetention = (
    returned: number | undefined,
    eligible: number | undefined
  ) => {
    if (returned === undefined || eligible === undefined) return "—";
    if (eligible === 0) return "Not enough data";

    return `${((returned / eligible) * 100).toFixed(1)}%`;
  };


  const platformStats = [
    {
      label: "Total users",
      value: result?.total_users,
      description: "Registered accounts",
      symbol: "U",
    },
    {
      label: "Total classes",
      value: result?.total_classes,
      description: "Classes created",
      symbol: "C",
    },
    {
      label: "Total assignments",
      value: result?.total_assignments,
      description: "Assignments added",
      symbol: "A",
    },
  ];

  const engagementStats = [
    {
      label: "Total events",
      value: analytics?.total_events,
      description: "Tracked interactions",
    },
    {
      label: "Unique visitors",
      value: analytics?.unique_visitors,
      description: "Distinct visitor IDs",
    },
    {
      label: "Sessions",
      value: analytics?.unique_sessions,
      description: "Distinct session IDs",
    },
    {
      label: "Returning visitors",
      value: analytics?.returning_visitors,
      description: "Visitors with multiple events",
    },
  ];

  const retentionStats = [
    {
      label: "Day 1",
      returned: analytics?.d1_returned,
      eligible: analytics?.d1_eligible,
      description: "Returned 24–48 hours after signup",
    },
    {
      label: "Day 7",
      returned: analytics?.d7_returned,
      eligible: analytics?.d7_eligible,
      description: "Returned 7–8 days after signup",
    },
    {
      label: "Day 30",
      returned: analytics?.d30_returned,
      eligible: analytics?.d30_eligible,
      description: "Returned 30–31 days after signup",
    },
  ];



  const activityStats = [
    {
      label: "Landing page views",
      value: analytics?.landing_views,
    },
    {
      label: "Signups",
      value: analytics?.signups,
    },
    {
      label: "Demo starts",
      value: analytics?.demo_starts,
    },
    {
      label: "Demo steps completed",
      value: analytics?.demo_completions,
    },
    {
      label: "Classes created",
      value: analytics?.classes_created,
    },
    {
      label: "Classes joined",
      value: analytics?.classes_joined,
    },
    {
      label: "Assignments created",
      value: analytics?.assignments_created,
    },
    {
      label: "Assignments completed",
      value: analytics?.assignments_completed,
    },
  ];

  return (
    <main className="min-h-screen bg-wash">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted font-medium">
                DueBird / Internal
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">
              Overview<span className="text-muted">.</span>
            </h1>

            <p className="text-muted text-sm sm:text-base mt-3">
              A look at how DueBird is growing.
            </p>
          </div>

          <div className="text-xs text-muted border border-hairline rounded-full px-3 py-2 w-fit">
            ADMIN DASHBOARD
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Platform overview</h2>
            <span className="text-xs text-muted">All-time totals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformStats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-hairline bg-paper p-5 sm:p-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-7">
                  <span className="text-sm text-muted">{stat.label}</span>
                  <span className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-xs font-medium text-muted">
                    {stat.symbol}
                  </span>
                </div>

                <p className="font-serif text-4xl sm:text-5xl tracking-tight tabular-nums">
                  {statsAvailable ? format(stat.value) : "—"}
                </p>

                <p className="text-xs text-muted mt-3">
                  {stat.description}
                </p>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    index === 0
                      ? "bg-ink"
                      : index === 1
                        ? "bg-ink/50"
                        : "bg-ink/25"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Engagement</h2>
            <span className="text-xs text-muted">All-time tracked activity</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {engagementStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-hairline bg-paper p-5"
              >
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="font-serif text-3xl mt-3 tabular-nums">
                  {analyticsAvailable ? format(stat.value) : "—"}
                </p>
                <p className="text-xs text-muted mt-2">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Signup retention</h2>
            <span className="text-xs text-muted">
              Elapsed time after signup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {retentionStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-hairline bg-paper p-5"
              >
                <p className="text-xs text-muted">{stat.label} retention</p>

                <p className="font-serif text-3xl mt-3 tabular-nums">
                  {analyticsAvailable
                    ? formatRetention(stat.returned, stat.eligible)
                    : "—"}
                </p>

                <p className="text-xs text-muted mt-2">
                  {analyticsAvailable
                    ? `${format(stat.returned)} / ${format(stat.eligible)} eligible users`
                    : "—"}
                </p>

                <p className="text-xs text-muted mt-3">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>
            
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Recent engagement</h2>
            <span className="text-xs text-muted">
              Authenticated users, excluding admin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Active users · 7 days",
                value: engagement?.active_users_7d,
                description: "Meaningful activity in the last 7 days",
              },
              {
                label: "Active users · 30 days",
                value: engagement?.active_users_30d,
                description: "Meaningful activity in the last 30 days",
              },
              {
                label: "Multi-day returners",
                value: engagement?.multi_day_returning_users,
                description: "Activity on at least 2 different days",
              },
            ].map((stat) => (
               <div
                key={stat.label}
                className="rounded-2xl border border-hairline bg-paper p-5"
              >
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="font-serif text-3xl mt-3 tabular-nums">
                  {engagement ? format(stat.value) : "—"}
                </p>
                <p className="text-xs text-muted mt-2">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>



        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Event breakdown</h2>
            <span className="text-xs text-muted">All-time counts</span>
          </div>

          <div className="rounded-2xl border border-hairline bg-paper divide-y divide-hairline">
            {activityStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="text-sm text-muted">{stat.label}</span>
                <span className="font-medium tabular-nums">
                  {analyticsAvailable ? format(stat.value) : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted mt-5 leading-relaxed">
          Analytics exclude events associated with the administrator&apos;s
          user and visitor IDs. Retention uses authenticated user activity.
          Historical events without timestamps are excluded from retention
          calculations.
        </p>

        <footer className="mt-12 pt-5 border-t border-hairline flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-muted">
            DueBird internal tools
          </p>
          <p className="text-xs text-muted">
            {statsAvailable && analyticsAvailable
              ? "All data loaded successfully"
              : "Some statistics could not be loaded"}
          </p>
        </footer>
      </div>
    </main>
  );
}
