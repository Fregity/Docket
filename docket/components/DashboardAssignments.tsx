"use client";

import { useEffect, useState } from "react";
import {
  bucketForDate,
  BUCKET_LABELS,
  type DueBucket,
} from "@/lib/dates";
import { AssignmentCard, type AssignmentData } from "@/components/AssignmentCard";
import { SectionLabel } from "@/components/ui";

type DashboardAssignment = AssignmentData & {
  className: string;
  accentColor: string;
};

export function DashboardAssignments({
  assignments,
  editableClasses,
}: {
  assignments: DashboardAssignment[];
  editableClasses: { id: string; name: string; accent_color: string }[];
}) {
  // Date buckets depend on the viewer's local calendar day. Keep the client
  // calculation after mount to avoid server/client timezone hydration mismatches.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="space-y-3" aria-label="Loading assignments" aria-busy="true">
        {[0, 1, 2].slice(0, Math.min(assignments.length, 3)).map((item) => (
          <div key={item} className="space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-wash" />
            <div className="h-[88px] animate-pulse rounded-xl border border-hairline bg-wash/60" />
          </div>
        ))}
      </div>
    );
  }

  const buckets: DueBucket[] = [
    "overdue",
    "today",
    "tomorrow",
    "week",
    "nextweek",
    "later",
  ];

  return (
    <>
      {buckets.map((bucket) => {
        const items = assignments.filter(
          (assignment) => bucketForDate(assignment.due_date) === bucket
        );

        if (items.length === 0) return null;

        return (
          <section key={bucket}>
            <SectionLabel>{BUCKET_LABELS[bucket]}</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {items.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  className={assignment.className}
                  accentColor={assignment.accentColor}
                  showClassName
                  editableClasses={editableClasses}
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
