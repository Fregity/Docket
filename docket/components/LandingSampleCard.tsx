
"use client";

import { useState } from "react";

const initialAssignments = [
  {
    id: 1,
    subject: "BIO 101",
    title: "Lab report",
    detail: "Cell structure and function",
    due: "TOMORROW",
    initials: "AM",
    color: "green",
  },
  {
    id: 2,
    subject: "HISTORY",
    title: "Reading, Chapter 4",
    detail: "Notes and three discussion points",
    due: "MON",
    initials: "JL",
    color: "red",
  },
  {
    id: 3,
    subject: "CALCULUS",
    title: "Problem set",
    detail: "Exercises 2–18",
    due: "WED",
    initials: "SK",
    color: "green",
  },
];

export default function LandingSampleCard() {
  const [checked, setChecked] = useState<number[]>([]);

  function toggleAssignment(id: number) {
    setChecked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div className="sample-card-wrap">
      <div className="sample-tape" aria-hidden="true" />

      <article className="sample-card">
        <div className="sample-card-top">
          <div>
            <span className="sample-card-label">SHARED WITH YOUR CLASS</span>
            <h2>Things to get done.</h2>
          </div>
          <div className="sample-card-count">
            <strong>{checked.length}/{initialAssignments.length}</strong>
            <span>DONE</span>
          </div>
        </div>

        <div className="sample-class-line">
          <span className="sample-class-name">AP BIOLOGY</span>
          <span className="sample-class-members">6 CLASSMATES</span>
        </div>

        <div className="sample-assignment-list">
          {initialAssignments.map((assignment) => {
            const isChecked = checked.includes(assignment.id);

            return (
              <div
                className={`sample-assignment ${isChecked ? "is-checked" : ""}`}
                key={assignment.id}
              >
                <button
                  type="button"
                  className="sample-checkbox"
                  aria-label={
                    isChecked
                      ? `Mark ${assignment.title} incomplete`
                      : `Mark ${assignment.title} complete`
                  }
                  aria-pressed={isChecked}
                  onClick={() => toggleAssignment(assignment.id)}
                >
                  {isChecked && <span aria-hidden="true">✓</span>}
                </button>

                <div className="sample-assignment-copy">
                  <span className="sample-assignment-subject">
                    {assignment.subject}
                  </span>
                  <strong>{assignment.title}</strong>
                  <span className="sample-assignment-detail">
                    {assignment.detail}
                  </span>
                </div>

                <div className="sample-assignment-meta">
                  <span className={`sample-due sample-due-${assignment.color}`}>
                    {assignment.due}
                  </span>
                  <span className="sample-initials">
                    {assignment.initials}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sample-card-bottom">
          <span>EVERYONE SEES THE SAME LIST</span>
          <span>— DUEBIRD</span>
        </div>
      </article>

      <span className="sample-card-caption">
        A little less “what was the homework?”
      </span>
    </div>
  );
}
