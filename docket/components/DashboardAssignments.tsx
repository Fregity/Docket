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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

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
          (a) => bucketForDate(a.due_date) === bucket
        );

        if (items.length === 0) return null;

        return (
          <section key={bucket}>
            <SectionLabel>{BUCKET_LABELS[bucket]}</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {items.map((a) => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  className={a.className}
                  accentColor={a.accentColor}
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