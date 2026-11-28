"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./LandingLiveFeed.module.css";

type Person = "M" | "D" | "J" | "S" | "R";
type FeedEvent = { who: Person; action: "add" | "done"; task: string; due: string };
type Row = { key: number; event: FeedEvent; fresh: boolean };

const PEOPLE: Record<Person, { name: string; color: string }> = {
  M: { name: "Maya", color: "#f6c177" },
  D: { name: "Dev", color: "#9ccfd8" },
  J: { name: "Jo", color: "#eb9fb7" },
  S: { name: "Sam", color: "#b9a6f2" },
  R: { name: "Ria", color: "#a8d98e" },
};

const EVENTS: FeedEvent[] = [
  { who: "M", action: "add", task: "Bio lab report", due: "Fri" },
  { who: "D", action: "add", task: "Calc set 6", due: "Thu" },
  { who: "J", action: "add", task: "Read ch. 9", due: "Mon" },
  { who: "D", action: "done", task: "Calc set 6", due: "Thu" },
  { who: "S", action: "add", task: "Quiz: Unit 4", due: "Tue" },
  { who: "R", action: "add", task: "Essay draft", due: "Next Fri" },
  { who: "M", action: "done", task: "Bio lab report", due: "Fri" },
  { who: "J", action: "done", task: "Read ch. 9", due: "Mon" },
  { who: "S", action: "add", task: "History map", due: "Wed" },
];

const START_ROWS = 4;
const MAX_ROWS = 6;
const INTERVAL_MS = 2400;

export default function LandingLiveFeed() {
  const [rows, setRows] = useState<Row[]>(() =>
    EVENTS.slice(0, START_ROWS).map((event, key) => ({ key, event, fresh: false })),
  );
  const cursor = useRef(START_ROWS);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const n = cursor.current++;
      const event = EVENTS[n % EVENTS.length];
      setRows((prev) => [...prev, { key: n, event, fresh: true }].slice(-MAX_ROWS));
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className={styles.section} aria-hidden="true">
      <div className={styles.feed}>
        {rows.map(({ key, event, fresh }) => {
          const person = PEOPLE[event.who];
          const done = event.action === "done";
          const cls = [styles.row, fresh ? styles.fresh : "", done ? styles.done : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={key} className={cls} style={{ "--c": person.color } as CSSProperties}>
              <span className={styles.avatar}>{person.name[0]}</span>
              <span className={styles.text}>
                <b>{person.name}</b> {done ? "checked off" : "added"}{" "}
                <span className={styles.task}>{event.task}</span>
              </span>
              <span className={styles.check} />
              <span className={styles.due}>{event.due}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}