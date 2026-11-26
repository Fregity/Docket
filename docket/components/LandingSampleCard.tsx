
"use client";

import { useState } from "react";

const assignments = [
  { id: 1, title: "Cell lab report", due: "TOMORROW", initials: "AM" },
  { id: 2, title: "Chapter 4 questions", due: "MONDAY", initials: "JL" },
];

export default function LandingSampleCard() {
  const [checked, setChecked] = useState<number[]>([]);

  function toggle(id: number) {
    setChecked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div className="sample-card-wrap">
      <article className="sample-card">
        <div className="sample-card-top">
          <span className="sample-class-name">AP BIOLOGY</span>
          <span className="sample-member-count">6 classmates</span>
        </div>

        <div className="sample-assignment-list">
          {assignments.map((assignment) => {
            const done = checked.includes(assignment.id);

            return (
              <div
                key={assignment.id}
                className={`sample-assignment ${done ? "is-checked" : ""}`}
              >
                <button
                  type="button"
                  className="sample-checkbox"
                  aria-label={
                    done
                      ? `Mark ${assignment.title} incomplete`
                      : `Mark ${assignment.title} complete`
                  }
                  aria-pressed={done}
                  onClick={() => toggle(assignment.id)}
                >
                  {done ? "✓" : ""}
                </button>

                <span className="sample-assignment-title">
                  {assignment.title}
                </span>

                <span className="sample-due">{assignment.due}</span>
                <span className="sample-initials">{assignment.initials}</span>
              </div>
            );
          })}
        </div>

        <div className="sample-card-bottom">
          <span className="sample-avatar">A</span>
          <span className="sample-avatar">J</span>
          <span className="sample-avatar">S</span>
          <span className="sample-shared-label">Everyone sees the same list</span>
        </div>
      </article>
    </div>
  );
}
