"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// TODO: replace with real data from your backend once it exists
const kitData = [
  { kit: "IoT Starter", requested: 186 },
  { kit: "Robotics Lab", requested: 142 },
  { kit: "Sensor Kit", requested: 97 },
  { kit: "Advanced IoT", requested: 63 },
];

const kitConfig = {
  requested: { label: "Requests", color: "var(--color-blue)" },
} satisfies ChartConfig;

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38500 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 47800 },
  { month: "May", revenue: 61200 },
  { month: "Jun", revenue: 58900 },
  { month: "Jul", revenue: 67300 },
  { month: "Aug", revenue: 71500 },
  { month: "Sep", revenue: 64800 },
  { month: "Oct", revenue: 73200 },
  { month: "Nov", revenue: 79600 },
  { month: "Dec", revenue: 88400 },
];

const revenueConfig = {
  revenue: { label: "Revenue (NPR)", color: "var(--color-teal)" },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const totalRequests = kitData.reduce((sum, k) => sum + k.requested, 0);
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Kit requests and revenue performance overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kit Requests</CardDescription>
            <CardTitle className="text-3xl">{totalRequests}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue (YTD)</CardDescription>
            <CardTitle className="text-3xl">
              Rs. {totalRevenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Partner Schools</CardDescription>
            <CardTitle className="text-3xl">30+</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Students Trained</CardDescription>
            <CardTitle className="text-3xl">5000+</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kit Requests</CardTitle>
            <CardDescription>
              IoT and Lab kits requested by schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={kitConfig} className="h-72 w-full">
              <BarChart data={kitData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="kit"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="requested"
                  fill="var(--color-requested)"
                  radius={6}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend across the year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-72 w-full">
              <AreaChart data={revenueData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="var(--color-revenue)"
                  fillOpacity={0.25}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
