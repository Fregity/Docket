import { NavBar } from "@/components/NavBar";

export default function ClassesLoading() {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-10 pb-6 max-w-2xl mx-auto animate-pulse motion-reduce:animate-none">
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 w-32 rounded bg-ink/10" />
          <div className="flex gap-4">
            <div className="h-4 w-12 rounded bg-ink/10" />
            <div className="h-4 w-16 rounded bg-ink/10" />
          </div>
        </div>

        <div className="h-4 w-28 rounded bg-ink/10 mb-4" />

        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-ink/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-ink/10" />
                <div className="h-3 w-20 rounded bg-ink/10" />
              </div>
              <div className="h-8 w-5 rounded bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
}