"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import AddJob from "@/components/AddJob";
import { Input, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import JobsTable from "@/components/JobsTable";

const JobsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [jobNameFilter, setJobNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Jobs</h1>
          <div className="flex space-x-2 items-center">
            <Popover>
              <PopoverTrigger>
                <Button variant="secondary" className="flex items-center">
                  <FilterIcon className="h-5 w-5 mr-1" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-4 space-y-2">
                  <Input
                    placeholder="Filter by job name"
                    value={jobNameFilter}
                    onChange={(e) => setJobNameFilter(e.target.value)}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-1 w-full text-sm"
                  >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Search jobs..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            <AddJob />
          </div>
        </div>
      </nav>

      {/* Jobs Table */}
      <div className="max-w-7xl mx-auto p-4">
        <JobsTable
          globalFilter={globalFilter}
          jobNameFilter={jobNameFilter}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  );
};

export default JobsPage;