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
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const allowed = !!user?.email && allowlist.includes(user.email.toLowerCase());

  if (!user || !allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-muted text-[15px]">You don&rsquo;t have access to this page.</p>
      </main>
    );
  }

  const { data } = await supabase.rpc("admin_counts").maybeSingle();

  const stats = [
    { label: "Total users", value: data?.total_users ?? 0 },
    { label: "Total classes", value: data?.total_classes ?? 0 },
    { label: "Total assignments", value: data?.total_assignments ?? 0 },
  ];

  return (
    <main className="min-h-screen px-6 py-10 max-w-md mx-auto">
      <h1 className="font-serif text-3xl mb-8">Admin</h1>
      <div className="flex flex-col gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center justify-between">
            <span className="text-muted text-[15px]">{s.label}</span>
            <span className="font-serif text-2xl">{s.value}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
