"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { reorderClass } from "@/lib/actions/classes";
import { ColorDot } from "@/components/ui";

type ClassItem = {
  id: string;
  name: string;
  accent_color: string;
  period?: string | null;
};

export function ClassList({
  classes: initialClasses,
}: {
  classes: ClassItem[];
}) {
  const [classes, setClasses] = useState(initialClasses);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClasses(initialClasses);
  }, [initialClasses]);

  function moveClass(index: number, direction: "up" | "down") {
    if (pending) return;

    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= classes.length) return;

    const previous = classes;
    const next = [...classes];

    [next[index], next[target]] = [next[target], next[index]];

    setClasses(next);
    setError(null);

    startTransition(async () => {
      try {
        await reorderClass(previous[index].id, direction);
      } catch (err) {
        setClasses(previous);
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't reorder your classes."
        );
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {classes.map((cls, index) => (
          <div
            key={cls.id}
            className="card flex min-w-0 items-center gap-3"
          >
            <Link
              href={`/classes/${cls.id}`}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-3"
            >
              <ColorDot colorId={cls.accent_color} size={10} />

              <div className="min-w-0">
                <p className="truncate text-[15px]">{cls.name}</p>
                {cls.period && (
                  <p className="text-xs text-muted">
                    Period {cls.period}
                  </p>
                )}
              </div>
            </Link>

            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => moveClass(index, "up")}
                disabled={index === 0 || pending}
                aria-label={`Move ${cls.name} up`}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-faint transition-colors hover:bg-wash hover:text-ink disabled:opacity-30"
              >
                ▲
              </button>

              <button
                type="button"
                onClick={() => moveClass(index, "down")}
                disabled={index === classes.length - 1 || pending}
                aria-label={`Move ${cls.name} down`}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-faint transition-colors hover:bg-wash hover:text-ink disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </>
  );
}