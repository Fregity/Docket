import { NavBar } from "@/components/NavBar";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-10 pb-6 max-w-md mx-auto animate-pulse motion-reduce:animate-none">
        <div className="h-9 w-36 rounded bg-ink/10 mb-10" />

        {/* Display name */}
        <div className="mb-8">
          <div className="h-3 w-24 rounded bg-ink/10 mb-3" />
          <div className="h-12 w-full rounded-xl bg-ink/10" />
          <div className="h-10 w-20 rounded-xl bg-ink/10 mt-3" />
        </div>

        {/* Email */}
        <div className="mb-8">
          <div className="h-3 w-12 rounded bg-ink/10 mb-3" />
          <div className="h-5 w-48 rounded bg-ink/10" />
        </div>

        {/* Theme */}
        <div className="mb-8">
          <div className="h-5 w-32 rounded bg-ink/10" />
        </div>

        {/* Install */}
        <div className="mb-8">
          <div className="h-10 w-36 rounded-xl bg-ink/10" />
        </div>

        {/* Sign out */}
        <div className="h-10 w-24 rounded-xl bg-ink/10" />
      </div>
      <NavBar />
    </div>
  );
}