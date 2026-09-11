"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { joinClassByCode } from "@/lib/actions/classes";

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [showJoin, setShowJoin] = useState(params.get("intent") === "join");
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    startTransition(async () => {
      try {
        await joinClassByCode(code);
      } catch (err: any) {
        // Next.js 14 internal redirect/not-found bypass
        if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.digest === "NEXT_NOT_FOUND") {
          throw err;
        }
        setError("This invite code isn't valid.");
      }
    });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-muted mb-2">Docket</p>
      <h1 className="font-serif text-3xl mb-8 max-w-xs">Let&rsquo;s get your classes set up.</h1>

      {!showJoin ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/classes/new" className="btn-primary">
            Create a class
          </Link>
          <button className="btn-secondary" onClick={() => setShowJoin(true)}>
            Join a class
          </button>
          <button 
            className="btn-ghost mt-2" 
            onClick={() => router.push("/dashboard")}
          >
            Skip for now
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="flex flex-col gap-3 w-full max-w-xs">
          <input
            className="input text-center tracking-widest uppercase"
            placeholder="Invite code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            autoFocus
          />
          {error && <p className="text-sm" style={{ color: "#9C4A32" }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "Joining…" : "Join class"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setShowJoin(false)}>
            Back
          </button>
        </form>
      )}
    </main>
  );
}
