"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Label,
  YAxis,
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

interface Applicant {
  id: number;
  name: string;
  score?: number;
}

interface Job {
  id: number;
  job_name: string;
  job_department: string;
  job_description: string;
  section_description: string;
  status: boolean;
  applicants: Applicant[];
}

interface Interview {
  id: number;
  created_at: string;
  applicant_id: number;
  transcript: string;
  overall_rating: number; // Assuming 1–5 scale
}

interface Analysis {
  id: number;
  created_at: string;
  skill_name: string;
  skill_score: number; // e.g. 1–10 scale
  skill_reasoning: string;
  interview_id: number; // foreign key to interviews
}

/** Example Chart Configs */
const applicantsBarConfig = {
  applicantsCount: {
    label: "Applicants",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const jobStatusPieConfig = {
  active: {
    label: "Active Jobs",
    color: "hsl(var(--chart-2))",
  },
  inactive: {
    label: "Inactive Jobs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  // -----------------------------
  // State: Jobs
  // -----------------------------
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // -----------------------------
  // State: Interviews & Analysis
  // -----------------------------
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [analysis, setAnalysis] = useState<Analysis[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // -----------------------------
  // Fetch: Jobs
  // -----------------------------
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

  // -----------------------------
  // Fetch: Interviews & Analysis
  // -----------------------------
  const fetchInterviewsAndAnalysis = async () => {
    setDataLoading(true);

    // 1) Interviews
    const { data: interviewsData, error: interviewsError } = await supabase
      .from("interviews")
      .select("*");

    // 2) Analysis
    const { data: analysisData, error: analysisError } = await supabase
      .from("analysis")
      .select("*");

    if (interviewsError) {
      console.error("Error fetching interviews:", interviewsError);
      setDataError("Error fetching interviews");
    } else if (analysisError) {
      console.error("Error fetching analysis:", analysisError);
      setDataError("Error fetching analysis");
    } else {
      setInterviews(interviewsData as Interview[]);
      setAnalysis(analysisData as Analysis[]);
    }
    setDataLoading(false);
  };

  // -----------------------------
  // useEffect
  // -----------------------------
  useEffect(() => {
    fetchJobs();
    fetchInterviewsAndAnalysis();
  }, []);

  // -----------------------------
  // Chart Data: Applicants per Job
  // -----------------------------
  const applicantsBarData = useMemo(() => {
    return jobs.map((job) => ({
      jobName: job.job_name,
      applicantsCount: job.applicants?.length || 0,
    }));
  }, [jobs]);

  // -----------------------------
  // Chart Data: Active vs Inactive
  // -----------------------------
  const jobStatusPieData = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status).length;
    const inactiveJobs = jobs.length - activeJobs;
    return [
      { name: "Active", value: activeJobs, fill: "hsl(var(--chart-2))" },
      { name: "Inactive", value: inactiveJobs, fill: "hsl(var(--chart-3))" },
    ];
  }, [jobs]);

  // -----------------------------
  // Average (Normalized) Rating
  // Example: If overall_rating is 1–5,
  // then normalized = (avgRating / 5) * 100
  // -----------------------------
  // -----------------------------
// Average (Normalized) Rating
// -----------------------------
const rawAverageRating = useMemo(() => {
  if (!interviews.length) return 0;
  const sum = interviews.reduce(
    (acc, curr) => acc + (curr.overall_rating || 0),
    0
  );
  return sum / interviews.length;
}, [interviews]);

// Convert the raw average from a 1–100 scale to a 1–5 scale
const averageRating = useMemo(() => rawAverageRating / 20, [rawAverageRating]);

// Normalized rating is already on a 1–100 scale
const normalizedRating = useMemo(() => rawAverageRating, [rawAverageRating]);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicants Dashboard</h1>
      </header>

      {/* 
        1) Show new "Average Overall Rating" 
           You can style it however you'd like
      */}
      <div className="flex gap-4 flex-wrap">
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-sm text-gray-500">Average Rating (1-5)</p>
          <p className="text-2xl font-bold">{averageRating.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-sm text-gray-500">Normalized (%)</p>
          <p className="text-2xl font-bold">{normalizedRating.toFixed(2)}%</p>
        </div>
      </div>

      {/* 2) Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Bar Chart: Applicants per Job */}
        <ChartContainer
          config={applicantsBarConfig}
          className="h-[300px] w-full"
        >
          <BarChart data={applicantsBarData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="jobName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="applicantsCount"
              fill="var(--color-applicantsCount)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>

        {/* Pie Chart: Active vs Inactive Jobs */}
        <ChartContainer
          config={jobStatusPieConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={jobStatusPieData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const { cx, cy } = viewBox;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {jobs.length}
                        </tspan>
                        <tspan
                          x={cx}
                          y={(cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Jobs
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
              {jobStatusPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* 4) Display Analysis Data */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Analysis Data</h2>
        {dataLoading && <p>Loading analysis...</p>}
        {dataError && <p>{dataError}</p>}

        {!dataLoading && !dataError && analysis.length === 0 && (
          <p>No analysis data found.</p>
        )}

        {!dataLoading && !dataError && analysis.length > 0 && (
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="p-2 text-left">Skill Name</th>
                  <th className="p-2 text-left">Skill Score</th>
                  <th className="p-2 text-left">Reasoning</th>
                  <th className="p-2 text-left">Interview ID</th>
                </tr>
              </thead>
              <tbody>
                {analysis.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-2">{item.skill_name}</td>
                    <td className="p-2">{item.skill_score}</td>
                    <td className="p-2">{item.skill_reasoning}</td>
                    <td className="p-2">{item.interview_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* 3) Existing Cards for Jobs */}
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
