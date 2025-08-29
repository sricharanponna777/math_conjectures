"use client";
import { useEffect, useState } from "react";

export default function PerfectNumbersPage() {
  const [numbers, setNumbers] = useState<string[]>([]);

  useEffect(() => {
    // Known Mersenne prime exponents (small ones for demo)
    const exponents = [2, 3, 5, 7, 13, 17, 19, 31];
    const perfects = exponents.map((p) => {
      const mersenne = (BigInt(1) << BigInt(p)) - BigInt(1); // 2^p - 1
      const perfect = (BigInt(1) << BigInt(p - 1)) * mersenne; // 2^(p-1) * (2^p - 1)
      return perfect.toString();
    });
    setNumbers(perfects);
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
