"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

/**
 * Goldbach Visualizer
 * - Pick an even number N and see all prime pairs (p, q) with p + q = N
 * - Explore counts of Goldbach partitions for ranges of even numbers
 * - Built for Next.js (App Router). Marked "use client" for client rendering.
 *
 * Quick usage in Next.js (App Router):
 * 1) Ensure shadcn/ui is set up (or replace imports above with your own UI components).
 * 2) Create app/goldbach/page.tsx and export this component as default.
 * 3) Optionally adjust MAX_N for performance.
 */

// ---- Utilities: Primes ---- //
function sieve(limit: number): { isPrime: Uint8Array; primes: number[] } {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2); // mark 2..limit as true
  const primes: number[] = [];
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
    }
  }
  for (let i = 2; i <= limit; i++) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function goldbachPairs(n: number, isPrime: Uint8Array): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let p = 2; p <= n / 2; p++) {
    if (isPrime[p] && isPrime[n - p]) pairs.push([p, n - p]);
  }
  return pairs;
}

// Precompute once up to an adjustable cap
const DEFAULT_MAX_N = 200_000; // safe for demo; raise if needed

export default function GoldbachVisualizer() {
  const [maxNInput, setMaxNInput] = useState<number>(DEFAULT_MAX_N);
  const [evenN, setEvenN] = useState<number>(100);
  const [tab, setTab] = useState<string>("inspect");

  const { isPrime, primes, limit } = useMemo(() => {
    const cap = Math.max(10, Math.min(maxNInput, 5_000_000));
    const { isPrime, primes } = sieve(cap);
    return { isPrime, primes, limit: cap };
  }, [maxNInput]);

  const pairs = useMemo(() => goldbachPairs(evenN, isPrime), [evenN, isPrime]);

  const distributionData = useMemo(() => {
    const step = Math.ceil(limit / 200); // about 200 bars max for readability
    const data: { n: number; count: number }[] = [];
    for (let n = 4; n <= limit; n += 2) {
      let count = 0;
      for (let p = 2; p <= n / 2; p++) if (isPrime[p] && isPrime[n - p]) count++;
      // group into buckets for the bar chart for performance/readability
      if (n % (step * 2) === 0 || n === 4 || n === limit - (limit % 2)) {
        data.push({ n, count });
      }
    }
    return data;
  }, [isPrime, limit]);

  const runningMaxData = useMemo(() => {
    let runningMax = 0;
    const data: { n: number; maxCount: number }[] = [];
    for (let n = 4; n <= limit; n += 2) {
      let count = 0;
      for (let p = 2; p <= n / 2; p++) if (isPrime[p] && isPrime[n - p]) count++;
      if (count > runningMax) runningMax = count;
      if (n % Math.ceil(limit / 200) === 0 || n === 4 || n === limit - (limit % 2)) {
        data.push({ n, maxCount: runningMax });
      }
    }
    return data;
  }, [isPrime, limit]);

  // Keep slider value even
  const setEven = (val: number[]) => {
    const v = Math.max(4, Math.min(limit, val[0]));
    setEvenN(v % 2 === 0 ? v : v - 1);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Goldbach's Conjecture</h1>
      <p className="text-muted-foreground mb-6 max-w-3xl">
        Every even integer greater than 2 can be expressed as the sum of two prime numbers. This tool lets you
        <span className="font-medium"> inspect a specific even N</span> and <span className="font-medium">explore how many representations</span> appear across a range.
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6 grid gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Prime table size (max N)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={100}
                  max={5_000_000}
                  value={maxNInput}
                  onChange={(e) => setMaxNInput(Number(e.target.value) || DEFAULT_MAX_N)}
                />
                <Badge variant="secondary">current: {limit.toLocaleString()}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Higher values allow larger N but take longer to compute.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Choose an even number N</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider min={4} max={limit} step={2} value={[evenN]} onValueChange={setEven} />
                </div>
                <Input
                  className="w-28"
                  type="number"
                  min={4}
                  max={limit}
                  value={evenN}
                  onChange={(e) => setEven([Number(e.target.value) || 4])}
                />
                <Button onClick={() => setEven([Math.min(limit, evenN + 2)])}>+2</Button>
                <Button onClick={() => setEven([Math.max(4, evenN - 2)])}>-2</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="inspect">Inspect N</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="runningMax">Running Max</TabsTrigger>
        </TabsList>

        <TabsContent value="inspect" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Representations for N = {evenN.toLocaleString()}</h2>
              <p className="text-sm text-muted-foreground mb-4">Pairs (p, q) with p + q = {evenN} and p ≤ q.</p>
              <div className="flex flex-wrap gap-2">
                {pairs.length === 0 && <Badge variant="destructive">No pairs found (unexpected for tested ranges)</Badge>}
                {pairs.map(([p, q], idx) => (
                  <Badge key={`${p}-${q}-${idx}`} className="text-base py-2 px-3 rounded-2xl">
                    {p} + {q}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-sm">Total representations: <span className="font-medium">{pairs.length}</span></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Representations count across even N ≤ {limit.toLocaleString()}</h2>
              <p className="text-sm text-muted-foreground mb-4">Bars show the number of (p, q) pairs for each sampled even N.</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" tickFormatter={(v) => `${v}`} interval={"preserveStartEnd"} />
                    <YAxis />
                    <Tooltip formatter={(value: number, name: string) => [value, name === "count" ? "Count" : name]} labelFormatter={(label) => `N = ${label}`} />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runningMax" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Running maximum of representations up to N</h2>
              <p className="text-sm text-muted-foreground mb-4">Line shows the maximum number of representations seen up to each sampled even N.</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={runningMaxData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" tickFormatter={(v) => `${v}`} interval={"preserveStartEnd"} />
                    <YAxis />
                    <Tooltip formatter={(value: number, name: string) => [value, name === "maxCount" ? "Running Max" : name]} labelFormatter={(label) => `N = ${label}`} />
                    <Line type="monotone" dataKey="maxCount" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <p>
          Note: Goldbach's conjecture remains unproven. This explorer provides computational evidence by enumerating
          prime pairs within your chosen limit.
        </p>
        <p>
          Performance tips: If interaction becomes slow at large limits, reduce the prime table size or consider moving
          the counting loops into a Web Worker.
        </p>
      </div>
    </div>
  );
}