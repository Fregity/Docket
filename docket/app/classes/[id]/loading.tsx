import { NavBar } from "@/components/NavBar";

export default function ClassDetailLoading() {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-10 pb-4 max-w-2xl mx-auto animate-pulse motion-reduce:animate-none">
        {/* Back link */}
        <div className="h-4 w-24 rounded bg-ink/10 mb-5" />

        {/* Class heading */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-ink/10" />
          <div className="h-9 w-48 rounded bg-ink/10" />
        </div>
        <div className="h-3 w-20 rounded bg-ink/10 mb-6" />

        {/* Action buttons */}
        <div className="flex gap-3 mb-5">
          <div className="h-10 w-20 rounded-xl bg-ink/10" />
          <div className="h-10 w-32 rounded-xl bg-ink/10" />
          <div className="h-10 w-20 rounded-xl bg-ink/10" />
        </div>
        <div className="h-4 w-24 rounded bg-ink/10 mb-8" />

        {/* Assignments */}
        <div className="h-4 w-16 rounded bg-ink/10 mb-4" />
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-ink/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-ink/10" />
                <div className="h-3 w-1/3 rounded bg-ink/10" />
              </div>
              <div className="h-3 w-12 rounded bg-ink/10" />
            </div>
          ))}
        </div>

        {/* Members */}
        <div className="h-4 w-20 rounded bg-ink/10 mt-8 mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-8 w-20 rounded-xl bg-ink/10" />
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
}