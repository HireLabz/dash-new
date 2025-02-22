"use client";
import React from "react";
import { FilterIcon, PlusIcon } from "lucide-react";

// ShadCN UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import AddJob from "@/components/AddJob";

const fakeJobs = [
  { id: "1", title: "Frontend Developer", company: "Acme Corp", status: "Open" },
  { id: "2", title: "Backend Developer", company: "Beta Inc", status: "Closed" },
  { id: "3", title: "UI/UX Designer", company: "Gamma LLC", status: "Open" },
  { id: "4", title: "Full Stack Developer", company: "Delta Ltd", status: "Open" },
];

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Jobs</h1>
          <div className="flex space-x-2 items-center">
            <Button variant="secondary" className="flex items-center">
              <FilterIcon className="h-5 w-5 mr-1" />
              Filter
            </Button>
            <Input placeholder="Search jobs..." className="w-64" />
            <AddJob />
          </div>
        </div>
      </nav>

      {/* Jobs Table */}
      <div className="max-w-7xl mx-auto p-4">
        <Table>
          <TableCaption>A list of jobs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobsPage;