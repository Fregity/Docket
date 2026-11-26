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
        const result = await deleteAccount();

        if (result?.success) {
          window.location.assign("/");
        }
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
    <section className="rounded-2xl border border-hairline bg-paper p-5">
      <h2 className="text-sm font-semibold text-red-600">
        Delete account
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        Permanently delete your DueBird account, profile, class memberships,
        and personal completion records. Shared classes and assignments
        remain available to other members. This cannot be undone.
      </p>

      <label className="label mt-5" htmlFor="delete-confirmation">
        Type DELETE to confirm
      </label>

      <input
        id="delete-confirmation"
        className="input"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        placeholder="DELETE"
        autoComplete="off"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={confirmation !== "DELETE" || pending}
        className="mt-3 text-sm font-medium text-red-600 underline underline-offset-4 disabled:opacity-40"
      >
        {pending ? "Deleting account..." : "Permanently delete my account"}
      </button>
    </section>
  );
}
