"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { joinClassByCode } from "@/lib/actions/classes";

export function JoinButton({ code }: { code: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleJoin() {
    setError(null);
    startTransition(async () => {
      try {
        await joinClassByCode(code);
      } catch (err) {
        // redirect() inside the action throws internally on success — let
        // that signal propagate so the navigation actually happens.
        unstable_rethrow(err);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button className="btn-primary" onClick={handleJoin} disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </button>
      {error && <p className="text-sm" style={{ color: "#9C4A32" }}>{error}</p>}
    </div>
  );
}
