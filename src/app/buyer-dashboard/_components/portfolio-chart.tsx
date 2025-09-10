"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartYAxis,
  ChartXAxis,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", offset: 186 },
  { month: "February", offset: 205 },
  { month: "March", offset: 237 },
  { month: "April", offset: 173 },
  { month: "May", offset: 209 },
  { month: "June", offset: 214 },
  { month: "July", offset: 250 },
  { month: "August", offset: 230 },
  { month: "September", offset: 260 },
  { month: "October", offset: 280 },
  { month: "November", offset: 290 },
  { month: "December", offset: 310 },
]

const chartConfig = {
  offset: {
    label: "CO₂ Offset (Tonnes)",
    color: "hsl(var(--accent))",
  },
}

export function PortfolioChart() {
  return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis 
             tickLine={false}
             axisLine={false}
             tickMargin={10}
             label={{ value: 'Tonnes CO₂', angle: -90, position: 'insideLeft', offset: -5 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="offset" fill="var(--color-offset)" radius={4} />
        </BarChart>
      </ChartContainer>
  )
}
