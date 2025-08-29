"use client";
import { useEffect, useState } from "react";

export default function PerfectNumbersPage() {
  const [numbers, setNumbers] = useState<string[]>([]);

  useEffect(() => {
    const evtSource = new EventSource("/api?limit=50");
    evtSource.onmessage = (event) => {
      setNumbers((prev) => [...prev, event.data]);
    };
    return () => evtSource.close();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Mersenne Perfect Numbers</h1>
      <ul className="mt-4 space-y-2">
        {numbers.map((n, idx) => (
          <li key={idx} className="font-mono">{n}</li>
        ))}
      </ul>
    </main>
  );
}
