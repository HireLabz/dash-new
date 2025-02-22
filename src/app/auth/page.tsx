"use client";
import React from "react";
import { Button, Card } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";

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

const Dashboard = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applicants Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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