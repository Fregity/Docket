export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="max-w-3xl mx-auto animate-pulse motion-reduce:animate-none">
        {/* Header */}
        <div className="mb-8">
          <div className="h-3 w-20 rounded bg-ink/10 mb-3" />
          <div className="h-9 w-48 rounded bg-ink/10" />
        </div>

        {/* Assignment sections */}
        <div className="space-y-7">
          {[1, 2, 3].map((section) => (
            <section key={section}>
              <div className="h-5 w-32 rounded bg-ink/10 mb-3" />

              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="card flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-ink/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-ink/10" />
                      <div className="h-3 w-1/3 rounded bg-ink/10" />
                    </div>
                    <div className="h-3 w-14 rounded bg-ink/10" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Classes */}
        <section className="mt-9">
          <div className="h-6 w-28 rounded bg-ink/10 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-ink/10" />
                <div className="h-4 w-32 rounded bg-ink/10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}