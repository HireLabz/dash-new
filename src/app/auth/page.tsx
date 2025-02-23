"use client";
import React from "react";
import { Button, Card } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const fakeJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    applicants: [
      { id: "a1", name: "Alice Smith", score: 92 },
      { id: "a2", name: "Bob Johnson", score: 88 },
    ],
  },
  {
    id: "2",
    title: "Backend Developer",
    applicants: [
      { id: "a3", name: "Charlie Brown", score: 85 },
      { id: "a4", name: "Diana Prince", score: 90 },
    ],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    applicants: [
      { id: "a5", name: "Emily Davis", score: 95 },
      { id: "a6", name: "Frank Wilson", score: 80 },
    ],
  },
];

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const Dashboard = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicants Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
        {fakeJobs.map((job) => (
          <Card key={job.id} className="p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <div>
              {job.applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex justify-between border-b last:border-0 py-2"
                >
                  <span>{applicant.name}</span>
                  <span className="font-medium">{applicant.score}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
