import { NavBar } from "@/components/NavBar";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-10 pb-6 max-w-2xl mx-auto animate-pulse motion-reduce:animate-none">
        <div className="h-9 w-32 rounded bg-ink/10 mb-8" />

        {[1, 2, 3].map((section) => (
          <section key={section} className="mb-7">
            <div className="h-4 w-28 rounded bg-ink/10 mb-4" />

            <div className="flex flex-col gap-2">
              {[1, 2].map((item) => (
                <div key={item} className="card flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-ink/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-ink/10" />
                    <div className="h-3 w-1/3 rounded bg-ink/10" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <NavBar />
    </div>
  );
}