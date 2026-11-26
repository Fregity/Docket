"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Course = {
  id: string;
  code: string;
  name: string;
};

type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueLabel: string;
  addedBy: string;
};

const courses: Course[] = [
  { id: "biology", code: "BIO-101", name: "Biology" },
  { id: "math", code: "MATH-204", name: "Mathematics" },
  { id: "history", code: "HIST-110", name: "U.S. History" },
];

const initialAssignments: Assignment[] = [
  {
    id: "sample-1",
    courseId: "biology",
    title: "Lab report: cell respiration",
    dueLabel: "DUE TOMORROW",
    addedBy: "Maya K.",
  },
  {
    id: "sample-2",
    courseId: "math",
    title: "Problem set 06: limits and continuity",
    dueLabel: "DUE TODAY",
    addedBy: "Jordan R.",
  },
  {
    id: "sample-3",
    courseId: "history",
    title: "Primary source response: Federalist No. 10",
    dueLabel: "DUE MON, DEC 1",
    addedBy: "Alex P.",
  },
];

export function DemoDashboard() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [completed, setCompleted] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("biology");
  const [dueDate, setDueDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const started = useRef(false);

  const visibleAssignments =
    selectedCourse === "all"
      ? assignments
      : assignments.filter((assignment) => assignment.courseId === selectedCourse);

  function trackDemoStart() {
    if (started.current) return;
    started.current = true;
    void trackEvent("demo_started");
  }

  function toggleCompleted(id: string) {
    trackDemoStart();
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function addAssignment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    trackDemoStart();

    const dueLabel = dueDate
      ? `DUE ${new Date(`${dueDate}T12:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }).toUpperCase()}`
      : "DATE NOT SET";

    const newAssignment: Assignment = {
      id: `visitor-${Date.now()}`,
      courseId,
      title: cleanTitle,
      dueLabel,
      addedBy: "You · preview only",
    };

    setAssignments((current) => [newAssignment, ...current]);
    setSelectedCourse("all");
    setTitle("");
    setDueDate("");
    setShowAddForm(false);
  }

  return (
    <div className="border-b border-ink">
      <div className="flex flex-col gap-4 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.16em] text-muted">
            SHARED CLASS BOARD
          </p>
          <p className="mt-1 font-serif text-2xl tracking-[-0.03em]">
            Assignments
          </p>
        </div>

        <p className="font-mono text-[9px] tracking-[0.12em] text-muted">
          SAMPLE DATA · 14 CLASSMATES
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-hairline py-4">
        <button
          type="button"
          onClick={() => {
            trackDemoStart();
            setSelectedCourse("all");
          }}
          aria-pressed={selectedCourse === "all"}
          className={`font-mono text-[9px] tracking-[0.12em] underline-offset-[7px] ${
            selectedCourse === "all"
              ? "text-ink underline decoration-2"
              : "text-muted hover:text-ink"
          }`}
        >
          ALL CLASSES
        </button>

        {courses.map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => {
              trackDemoStart();
              setSelectedCourse(course.id);
            }}
            aria-pressed={selectedCourse === course.id}
            className={`font-mono text-[9px] tracking-[0.12em] underline-offset-[7px] ${
              selectedCourse === course.id
                ? "text-ink underline decoration-2"
                : "text-muted hover:text-ink"
            }`}
          >
            {course.code}
          </button>
        ))}
      </div>

      <div className="min-h-[270px]">
        {visibleAssignments.length > 0 ? (
          visibleAssignments.map((assignment) => {
            const course = courses.find(
              (item) => item.id === assignment.courseId
            );
            const isCompleted = completed.includes(assignment.id);
            const isUrgent =
              assignment.dueLabel === "DUE TOMORROW" ||
              assignment.dueLabel === "DUE TODAY";

            return (
              <article
                key={assignment.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-hairline py-5 sm:grid-cols-[125px_minmax(0,1fr)_160px]"
              >
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted">
                  {course?.code}
                </p>

                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(assignment.id)}
                    aria-pressed={isCompleted}
                    className={`text-left font-serif text-xl leading-tight tracking-[-0.025em] decoration-1 underline-offset-4 hover:underline ${
                      isCompleted
                        ? "text-muted line-through"
                        : "text-ink"
                    }`}
                  >
                    {assignment.title}
                  </button>

                  <p className="mt-2 font-mono text-[9px] tracking-[0.04em] text-muted">
                    Added by {assignment.addedBy}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] ${
                      isUrgent && !isCompleted
                        ? "text-[#D9381E]"
                        : "text-muted"
                    }`}
                  >
                    {isCompleted ? "COMPLETED" : assignment.dueLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleCompleted(assignment.id)}
                    className="font-mono text-[9px] tracking-wide text-muted underline decoration-hairline underline-offset-4 hover:text-ink"
                  >
                    {isCompleted ? "UNDO" : "MARK DONE"}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <p className="py-12 font-serif text-xl text-muted">
            No assignments in this course yet.
          </p>
        )}
      </div>

      <div className="border-t border-ink py-4">
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => {
              trackDemoStart();
              setShowAddForm(true);
            }}
            className="font-mono text-[10px] tracking-wide text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
          >
            + ADD AN ASSIGNMENT
          </button>
        ) : (
          <form onSubmit={addAssignment} className="grid gap-3 sm:grid-cols-[1fr_150px_150px_auto]">
            <label className="sr-only" htmlFor="demo-assignment-title">
              Assignment title
            </label>
            <input
              id="demo-assignment-title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Assignment title"
              maxLength={120}
              required
              className="min-h-11 min-w-0 border border-hairline bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-ink"
            />

            <label className="sr-only" htmlFor="demo-assignment-course">
              Course
            </label>
            <select
              id="demo-assignment-course"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              className="min-h-11 border border-hairline bg-transparent px-3 font-mono text-[10px] text-ink outline-none focus:border-ink"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="demo-assignment-date">
              Due date
            </label>
            <input
              id="demo-assignment-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="min-h-11 min-w-0 border border-hairline bg-transparent px-3 font-mono text-[10px] text-ink outline-none focus:border-ink"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="min-h-11 border border-ink bg-ink px-4 font-mono text-[9px] tracking-wide text-paper hover:bg-transparent hover:text-ink"
              >
                ADD
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="min-h-11 px-2 font-mono text-[9px] text-muted underline underline-offset-4 hover:text-ink"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="border-t border-hairline py-3 font-mono text-[9px] leading-5 tracking-[0.04em] text-muted">
        THIS IS AN INTERACTIVE PREVIEW. CHANGES ARE LOCAL TO THIS PAGE AND ARE
        NOT SHARED WITH A REAL CLASS.
      </p>
    </div>
  );
}
