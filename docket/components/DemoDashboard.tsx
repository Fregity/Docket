
"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { isoDateFromOffset, relativeDueLabel } from "@/lib/dates";
import { ColorDot } from "@/components/ui";

const demoClasses = [
  { id: "biology", name: "Biology", accent_color: "green" },
  { id: "algebra", name: "Algebra II", accent_color: "blue" },
  { id: "history", name: "U.S. History", accent_color: "orange" },
];

const demoAssignments = [
  {
    id: "demo-1",
    class_id: "biology",
    title: "Cell structure worksheet",
    due_date: isoDateFromOffset(1),
  },
  {
    id: "demo-2",
    class_id: "algebra",
    title: "Complete problems 1–20",
    due_date: isoDateFromOffset(0),
  },
];

export function DemoDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const started = useRef(false);
  const completed = useRef(false);

  const visibleAssignments = selectedClass
    ? demoAssignments.filter((a) => a.class_id === selectedClass)
    : demoAssignments;

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
    <section className="w-full max-w-lg mx-auto px-5 py-5">
      <div className="text-center mb-4">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">
          Interactive preview
        </p>
        <h2 className="font-serif text-2xl text-ink">
          See how DueBird works
        </h2>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg text-ink">
            {selectedClass
              ? demoClasses.find((c) => c.id === selectedClass)?.name
              : "Upcoming"}
          </h3>
          {selectedClass && (
            <button
              onClick={() => selectClass(null)}
              className="text-xs text-muted underline underline-offset-2"
            >
              Show all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {visibleAssignments.length > 0 ? (
            visibleAssignments.map((assignment) => {
              const classInfo = demoClasses.find(
                (c) => c.id === assignment.class_id
              )!;

              return (
                <div
                  key={assignment.id}
                  className="card flex items-center gap-3"
                >
                  <span className="w-5 h-5 shrink-0 rounded-full border-2 border-faint" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">
                      {assignment.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <ColorDot colorId={classInfo.accent_color} size={7} />
                      <span className="text-xs text-muted">
                        {classInfo.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {relativeDueLabel(assignment.due_date)}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="card text-sm text-muted text-center">
              No sample assignments for this class.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 mb-2">
          <h3 className="font-serif text-lg text-ink">My classes</h3>
          <span className="text-xs text-muted">3 classes</span>
        </div>

        <div className="flex flex-col gap-2">
          {demoClasses.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                selectClass(selectedClass === c.id ? null : c.id)
              }
              className={`card w-full flex items-center gap-3 text-left py-3 transition-colors ${
                selectedClass === c.id ? "border-ink" : "hover:border-faint"
              }`}
            >
              <ColorDot colorId={c.accent_color} size={9} />
              <span className="text-sm text-ink flex-1">{c.name}</span>
              <span className="text-xs text-faint">
                {selectedClass === c.id ? "✓" : "›"}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted text-center mt-3">
          Sample dashboard · Your classes are shared with classmates
        </p>
      </div>
    </section>
  );
}
