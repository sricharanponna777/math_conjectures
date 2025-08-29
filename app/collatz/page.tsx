"use client"

import React, { useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart" // <-- path to your wrapper
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"

// --- Collatz helpers ---
function collatz(n: number, maxSteps = 5000) {
  const seq: number[] = [n]
  let steps = 0
  while (n !== 1 && steps < maxSteps) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1
    seq.push(n)
    steps++
  }
  return seq
}
function toChartData(seq: number[]) {
  return seq.map((value, idx) => ({ step: idx, value }))
}

// --- Component ---
export default function CollatzChart() {
  const { theme } = useTheme()
  const [n, setN] = useState(27)
  const seq = useMemo(() => collatz(n), [n])
  const data = useMemo(() => toChartData(seq), [seq])

  const randomize = () => setN(Math.floor(Math.random() * 5000) + 1)

  // chart color config
  const config: ChartConfig = {
    value: {
      label: "Collatz Value",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))", // or another color for dark mode
      },
    },
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Collatz Sequence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            value={n}
            min={1}
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
          />
          <Button onClick={randomize}>
            <RefreshCw className="h-4 w-4 mr-1" /> Random
          </Button>
        </div>

        <ChartContainer config={config} className="h-[320px] w-full">
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="step" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Line
      type="monotone"
      dataKey="value"
      stroke={theme === 'dark' ? "white" : "white"}
      dot={false}
      strokeWidth={2}
    />
  </LineChart>
</ChartContainer>

      </CardContent>
    </Card>
  )
}
