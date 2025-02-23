"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useSession } from "next-auth/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

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

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface Job {
  id: number;
  job_name: string;
  job_department: string;
  job_description: string;
  section_description: string;
  status: boolean;
  // The applicants field is returned as an array if you have a foreign key relationship set up.
  applicants: Array<{
    id: number;
    name: string;
    score?: number;
  }>;
}

const Dashboard = () => {
  const session = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Fetch jobs along with their applicants from Supabase
  const fetchJobs = async () => {
    setJobsLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, applicants(*)")
      .order("id", { ascending: true });
    if (error) {
      console.error("Error fetching jobs:", error);
      setJobsError("Error fetching jobs");
    } else {
      setJobs(data as Job[]);
    }
    setJobsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
    // Optionally, add real-time subscription for jobs/applicants changes.
  }, []);

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicants Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={barChartData}>
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
        {/* Pie Chart */}
        <ChartContainer
          config={pieChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Jobs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {jobsLoading && <p>Loading jobs...</p>}
        {jobsError && <p>{jobsError}</p>}
        {!jobsLoading &&
          jobs.map((job) => (
            <Card key={job.id} className="p-4 shadow rounded-lg">
              <CardHeader className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{job.job_name}</h2>
                <div
                  className={`px-2 py-1 rounded-full text-sm ${
                    job.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {job.status ? "Active" : "Inactive"}
                </div>
              </CardHeader>
              <CardBody className="flex flex-col">
                <p className="text-sm text-muted-foreground">
                  {job.job_description}
                </p>
                <div className="mt-4">
                  <p className="text-sm">
                    Applicants: {job.applicants ? job.applicants.length : 0}
                  </p>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = `${window.location.origin}/jobs/${job.id}`;
                    navigator.clipboard.writeText(link);
                    toast.success("Job link copied to clipboard!");
                  }}
                >
                  <CopyIcon className="mr-2" />
                  Copy Job Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert("View Details clicked")}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
