"use client";

import { useState, useTransition } from "react";
// 1. Change the import to use isRedirectError
import { isRedirectError } from "next/dist/client/components/redirect";
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
        // 2. Use isRedirectError to let the redirect signal propagate
        if (isRedirectError(err)) {
          throw err;
        }
        
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
