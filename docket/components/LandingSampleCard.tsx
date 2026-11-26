
"use client";

import { useState } from "react";

const assignments = ["Lab report", "Packet"];

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
    <aside
      className="sample-card"
      aria-label="Example Biology class assignment list"
    >
      <h2>Biology</h2>

      <ul>
        {assignments.map((assignment, index) => {
          const done = checked.includes(index);

          return (
            <li key={assignment}>
              <button
                type="button"
                className={`sample-check ${done ? "is-checked" : ""}`}
                aria-label={`Mark ${assignment} ${done ? "incomplete" : "complete"}`}
                aria-pressed={done}
                onClick={() => toggle(index)}
              >
                {done ? "✓" : ""}
              </button>
              <span className={done ? "is-checked-text" : ""}>
                {assignment}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
