'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// Mock data for charts
const deliveryTimesData = [
  { day: 'Mon', avgTime: 32, deliveries: 50 },
  { day: 'Tue', avgTime: 28, deliveries: 65 },
  { day: 'Wed', avgTime: 35, deliveries: 58 },
  { day: 'Thu', avgTime: 30, deliveries: 70 },
  { day: 'Fri', avgTime: 40, deliveries: 80 },
  { day: 'Sat', avgTime: 45, deliveries: 95 },
  { day: 'Sun', avgTime: 38, deliveries: 60 },
];

const orderStatusData = [
  { name: 'Delivered On-Time', value: 400, fill: 'var(--color-delivered)' },
  { name: 'Delivered Late', value: 50, fill: 'var(--color-delayed)' },
  { name: 'In Progress', value: 150, fill: 'var(--color-inProgress)' },
];

const courierPerformanceData = [
  { name: 'John Doe', deliveries: 120, onTimeRate: 95 },
  { name: 'Jane Smith', deliveries: 150, onTimeRate: 92 },
  { name: 'Mike Ross', deliveries: 90, onTimeRate: 98 },
  { name: 'Sarah Connor', deliveries: 110, onTimeRate: 89 },
];

const chartConfigBase = {
  avgTime: { label: "Avg. Delivery Time (min)", color: "hsl(var(--chart-1))" },
  deliveries: { label: "Total Deliveries", color: "hsl(var(--chart-2))" },
  onTimeRate: { label: "On-Time Rate (%)", color: "hsl(var(--chart-1))" },
  delivered: { label: "Delivered On-Time", color: "hsl(var(--chart-1))" },
  delayed: { label: "Delivered Late", color: "hsl(var(--chart-4))" },
  inProgress: { label: "In Progress", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export function DeliveryAnalyticsCharts() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or null on the server
    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            <div className="h-[350px] bg-muted rounded-md animate-pulse"></div>
            <div className="h-[350px] bg-muted rounded-md animate-pulse"></div>
            <div className="h-[350px] bg-muted rounded-md animate-pulse lg:col-span-2 xl:col-span-1"></div>
            <div className="h-[350px] bg-muted rounded-md animate-pulse lg:col-span-2 xl:col-span-1"></div>
        </div>
    );
  }
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Daily Delivery Performance</CardTitle>
          <CardDescription>Average delivery time and total deliveries per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryTimesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" label={{ value: 'Avg Time (min)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Deliveries', angle: -90, position: 'insideRight', offset:-10 }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} dot={{ r: 4 }} name="Avg. Time"/>
                    <Line yAxisId="right" type="monotone" dataKey="deliveries" stroke="var(--color-deliveries)" strokeWidth={2} dot={{ r: 4 }} name="Deliveries"/>
                </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Order Status Distribution</CardTitle>
          <CardDescription>Breakdown of current order statuses.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer config={chartConfigBase} className="h-[300px] w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="shadow-md lg:col-span-2 xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Courier Performance</CardTitle>
          <CardDescription>Deliveries and on-time rates per courier.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courierPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" dataKey="deliveries" />
                <YAxis yAxisId="right" orientation="right" dataKey="onTimeRate" unit="%" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="deliveries" fill="var(--color-deliveries)" radius={[4, 4, 0, 0]} name="Total Deliveries"/>
                <Bar yAxisId="right" dataKey="onTimeRate" fill="var(--color-onTimeRate)" radius={[4, 4, 0, 0]} name="On-Time Rate"/>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

