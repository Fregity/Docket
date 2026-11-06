
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface AdminStats {
  total_users: number;
  total_classes: number;
  total_assignments: number;
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

  const { data, error } = await supabase
    .rpc("admin_counts")
    .maybeSingle();

  if (error) {
    console.error("admin_counts RPC error:", error);
  }

  const result = data as AdminStats | null;
  const statsAvailable = !error && result !== null;

  const stats = [
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

  const formatted = (value: number | undefined) =>
    statsAvailable && value !== undefined
      ? value.toLocaleString("en-US")
      : "—";

  return (
    <main className="min-h-screen bg-wash">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Header */}
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

        {/* Main stats */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Platform overview</h2>
            <span className="text-xs text-muted">All-time totals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat, index) => (
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
                  {formatted(stat.value)}
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

        {/* Analytics area */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Analytics</h2>
            <span className="text-xs text-muted">More metrics coming</span>
          </div>

          <div className="rounded-2xl border border-hairline bg-paper p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-wash flex items-center justify-center shrink-0">
                <span className="text-lg text-muted">↗</span>
              </div>

              <div>
                <h3 className="font-serif text-xl mb-2">
                  The bigger picture
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xl">
                  This is where growth trends, new signups, activity,
                  class distribution, and assignment trends will live.
                  The current database endpoint only provides the three
                  all-time totals above.
                </p>
              </div>
            </div>

            <div className="border-t border-hairline mt-6 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Growth", "Engagement", "Classes", "Assignments"].map(
                (item) => (
                  <div key={item}>
                    <p className="text-xs text-muted">{item}</p>
                    <p className="text-sm mt-1">Not available yet</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-5 border-t border-hairline flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-muted">
            DueBird internal tools
          </p>
          <p className="text-xs text-muted">
            {statsAvailable ? "Data loaded successfully" : "Unable to load statistics"}
          </p>
        </footer>
      </div>
    </main>
  );
}
