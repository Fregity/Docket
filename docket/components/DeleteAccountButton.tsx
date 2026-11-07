"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/lib/actions/account";

export function DeleteAccountButton() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError("");

    startTransition(async () => {
      try {
        await deleteAccount();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    });
  }

  return (
    <section className="border-t border-border pt-6">
      <h2 className="font-serif text-xl text-ink">Delete account</h2>

      <p className="text-sm text-muted mt-2">
        Permanently delete your DueBird account, profile, class memberships,
        and personal completion records. Shared classes and assignments
        remain available to other members. This cannot be undone.
      </p>

      <label className="label block mt-4">
        Type DELETE to confirm
      </label>

      <input
        className="input"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        placeholder="DELETE"
        autoComplete="off"
      />

      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={confirmation !== "DELETE" || pending}
        className="mt-3 text-sm text-red-600 underline underline-offset-4 disabled:opacity-40"
      >
        {pending ? "Deleting account..." : "Permanently delete my account"}
      </button>
    </section>
  );
}