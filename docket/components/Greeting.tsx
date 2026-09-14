"use client";

import { useEffect, useState } from "react";

export function Greeting({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <h1 className="font-serif text-3xl text-ink">
      {greeting}, {firstName}
    </h1>
  );
}