"use client";
import { useState } from "react";

export default function PerfectNumbersPage() {
  const [numbers, setNumbers] = useState<{ p: number; perfect: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchStream() {
    setNumbers([]);
    setLoading(true);

    const res = await fetch("/api/");
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    let buf = "";
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const parts = buf.split("\n");
      buf = parts.pop() || "";

      for (const line of parts) {
        if (!line.trim()) continue;
        const item = JSON.parse(line);
        setNumbers((prev) => [...prev, item]);
      }
    }

    setLoading(false);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Mersenne Perfect Numbers</h1>

      <button
        onClick={fetchStream}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Loading..." : "Fetch Perfect Numbers"}
      </button>

      <ul className="mt-6 space-y-2">
        {numbers.map((n) => (
          <li key={n.p} className="font-mono">
            {n.perfect}
          </li>
        ))}
      </ul>
    </main>
  );
}
