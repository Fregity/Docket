
"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  bucketForDate,
  BUCKET_LABELS,
  isoDateFromOffset,
  type DueBucket,
} from "@/lib/dates";
import {
  AssignmentCard,
  type AssignmentData,
} from "@/components/AssignmentCard";
import { ColorDot, SectionLabel } from "@/components/ui";

const demoClasses = [
  {
    id: "biology",
    name: "Biology",
    accent_color: "green",
  },
  {
    id: "algebra",
    name: "Algebra II",
    accent_color: "blue",
  },
  {
    id: "history",
    name: "U.S. History",
    accent_color: "orange",
  },
];

const demoAssignments: (AssignmentData & {
  className: string;
  accentColor: string;
})[] = [
  {
    id: "demo-1",
    class_id: "biology",
    title: "Cell structure worksheet",
    description: null,
    due_date: isoDateFromOffset(1),
    completed: false,
    created_by_name: "Alex",
    className: "Biology",
    accentColor: "green",
  },
  {
    id: "demo-2",
    class_id: "algebra",
    title: "Complete problems 1–20",
    description: "Textbook pages 84–85",
    due_date: isoDateFromOffset(0),
    completed: false,
    created_by_name: "Jordan",
    className: "Algebra II",
    accentColor: "blue",
  },
  {
    id: "demo-3",
    class_id: "history",
    title: "Read pages 142–158",
    description: null,
    due_date: isoDateFromOffset(3),
    completed: false,
    created_by_name: "Sam",
    className: "U.S. History",
    accentColor: "orange",
  },
  {
    id: "demo-4",
    class_id: "biology",
    title: "Photosynthesis lab questions",
    description: "Finish the analysis questions",
    due_date: isoDateFromOffset(6),
    completed: false,
    created_by_name: "Alex",
    className: "Biology",
    accentColor: "green",
  },
  {
    id: "demo-5",
    class_id: "algebra",
    title: "Study for the quiz",
    description: null,
    due_date: isoDateFromOffset(9),
    completed: false,
    created_by_name: "Taylor",
    className: "Algebra II",
    accentColor: "blue",
  },
  {
    id: "demo-6",
    class_id: "history",
    title: "Finish Civil War notes",
    description: null,
    due_date: isoDateFromOffset(1),
    completed: false,
    created_by_name: "Sam",
    className: "U.S. History",
    accentColor: "orange",
  },
  {
    id: "demo-7",
    class_id: "biology",
    title: "Review chapter 8",
    description: null,
    due_date: isoDateFromOffset(15),
    completed: false,
    created_by_name: "Alex",
    className: "Biology",
    accentColor: "green",
  },
];

const buckets: DueBucket[] = [
  "overdue",
  "today",
  "tomorrow",
  "week",
  "nextweek",
  "later",
];

export function DemoDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const started = useRef(false);
  const completed = useRef(false);

  const visibleAssignments = selectedClass
    ? demoAssignments.filter((a) => a.class_id === selectedClass)
    : demoAssignments;

  const grouped = buckets.map((bucket) => ({
    bucket,
    items: visibleAssignments.filter(
      (a) => bucketForDate(a.due_date) === bucket
    ),
  }));

  function selectClass(id: string | null) {
    if (id === selectedClass) return;

    if (!started.current) {
      started.current = true;
      void trackEvent("demo_started");
    }

    setSelectedClass(id);

    if (!completed.current) {
      completed.current = true;
      void trackEvent("demo_step_completed", {
        step: "class_selection",
      });
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-muted mb-2">
          Interactive preview
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-ink">
          Your homework
        </h2>
        <p className="text-sm text-muted mt-2">
          Here's what your DueBird dashboard could look like.
        </p>
      </div>

      <main>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-ink">
              {selectedClass
                ? demoClasses.find((c) => c.id === selectedClass)?.name
                : "Upcoming assignments"}
            </h3>
            <p className="text-xs text-muted mt-1">
              {selectedClass
                ? "Assignments for this class"
                : "Homework from all your classes"}
            </p>
          </div>

          {selectedClass && (
            <button
              onClick={() => selectClass(null)}
              className="text-sm text-muted underline underline-offset-2"
            >
              All classes
            </button>
          )}
        </div>

        {grouped.map(
          ({ bucket, items }) =>
            items.length > 0 && (
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
                      editableClasses={demoClasses}
                      readOnly
                    />
                  ))}
                </div>
              </section>
            )
        )}

        <div className="flex items-center justify-between mt-9 mb-3">
          <h3 className="font-serif text-lg text-ink">
            My classes
          </h3>
          <span className="text-xs text-muted">
            {demoClasses.length} classes
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {demoClasses.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                selectClass(selectedClass === c.id ? null : c.id)
              }
              className={`card w-full flex items-center gap-3 text-left transition-colors ${
                selectedClass === c.id
                  ? "border-ink"
                  : "hover:border-faint"
              }`}
            >
              <ColorDot colorId={c.accent_color} size={10} />

              <span className="text-[15px] flex-1 truncate">
                {c.name}
              </span>

              <span className="text-faint text-sm">
                {selectedClass === c.id ? "✓" : "›"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-wash px-4 py-3">
          <p className="text-xs text-muted text-center">
            Sample account — your real classes and assignments are shared
            with your classmates.
          </p>
        </div>
      </main>
    </section>
  );
}
