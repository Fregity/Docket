import { createClient } from "@/lib/supabase/server";
import { ColorDot, EmptyState, SectionLabel } from "@/components/ui";
import { NavBar } from "@/components/NavBar";
import { formatWhen } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("class_members")
    .select("class_id")
    .eq("user_id", user.id);

  const classIds = (memberships ?? []).map((m) => m.class_id);

  let items: {
    id: string;
    title: string;
    due_date: string;
    className: string;
    accentColor: string;
  }[] = [];

  if (classIds.length > 0) {
    const { data } = await supabase
      .from("assignments")
      .select("id, title, due_date, classes(name, accent_color)")
      .in("class_id", classIds)
      .order("due_date", { ascending: false })
      .limit(100);

    items = (data ?? []).map((a: any) => ({
      id: a.id,
      title: a.title,
      due_date: a.due_date,
      className: a.classes?.name ?? "",
      accentColor: a.classes?.accent_color ?? "olive",
    }));
  }

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = formatWhen(item.due_date + "T00:00:00");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-10 pb-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink">History</h1>
      </header>

      <main className="px-6 max-w-2xl mx-auto">
        {items.length === 0 ? (
          <EmptyState title="Nothing yet" body="Assignments will show up here once they're added." />
        ) : (
          [...groups.entries()].map(([date, group]) => (
            <section key={date}>
              <SectionLabel>{date}</SectionLabel>
              <div className="flex flex-col gap-2">
                {group.map((a) => (
                  <div key={a.id} className="card flex items-center gap-3">
                    <ColorDot colorId={a.accentColor} size={8} />
                    <div>
                      <p className="text-[15px]">{a.title}</p>
                      <p className="text-xs text-muted">{a.className}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <NavBar />
    </div>
  );
}
