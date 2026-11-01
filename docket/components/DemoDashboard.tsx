
"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const demoClasses = [
  {
    id: "biology",
    name: "Biology",
    color: "#779B72",
    assignments: [
      { title: "Cell structure worksheet", due: "Tomorrow" },
      { title: "Read chapter 8", due: "Wednesday" },
      { title: "Photosynthesis lab questions", due: "Friday" },
    ],
  },
  {
    id: "algebra",
    name: "Algebra",
    color: "#7895B2",
    assignments: [
      { title: "Complete problems 1–20", due: "Tomorrow" },
      { title: "Study for the quiz", due: "Thursday" },
    ],
  },
  {
    id: "history",
    name: "History",
    color: "#B58B65",
    assignments: [
      { title: "Read pages 142–158", due: "Wednesday" },
      { title: "Finish Civil War notes", due: "Friday" },
      { title: "Primary source analysis", due: "Next Monday" },
    ],
  },
];

export function DemoDashboard() {
  const [selectedClass, setSelectedClass] = useState("biology");
  const started = useRef(false);
  const completed = useRef(false);

  const currentClass =
    demoClasses.find((c) => c.id === selectedClass) ?? demoClasses[0];

  function selectClass(id: string) {
    if (id === selectedClass) return;

    if (!started.current) {
      started.current = true;
      void trackEvent("demo_started");
    }

    setSelectedClass(id);

    if (!completed.current) {
      completed.current = true;
      void trackEvent("demo_step_completed", {
        step: "class_switching",
      });
    }
  }

  return (
    <section className="w-full max-w-xl mx-auto px-5 py-12">
      <div className="text-center mb-7">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">
          Interactive preview
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-ink">
          Your classes. Your homework. All in one place.
        </h2>
        <p className="text-sm text-muted mt-3">
          Pick a class to see what you have coming up.
        </p>
      </div>

      <div className="rounded-2xl border border-hairline bg-paper overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
          <span className="font-serif text-lg">My classes</span>
          <span className="text-xs text-muted">Sample account</span>
        </div>

        <div className="flex gap-2 p-3 border-b border-hairline overflow-x-auto">
          {demoClasses.map((c) => (
            <button
              key={c.id}
              onClick={() => selectClass(c.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedClass === c.id
                  ? "bg-ink text-paper"
                  : "bg-wash text-muted hover:text-ink"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="p-5 min-h-64">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentClass.color }}
            />
            <h3 className="font-serif text-xl">{currentClass.name}</h3>
            <span className="text-xs text-muted ml-auto">
              {currentClass.assignments.length} assignments
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {currentClass.assignments.map((assignment) => (
              <div
                key={assignment.title}
                className="rounded-xl border border-hairline p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-4 h-4 rounded-full border-2 border-hairline shrink-0" />
                  <span className="text-sm truncate">
                    {assignment.title}
                  </span>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {assignment.due}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 bg-wash border-t border-hairline">
          <p className="text-xs text-muted text-center">
            This is a sample dashboard. Your real classes are shared with classmates.
          </p>
        </div>
      </div>
    </section>
  );
}
