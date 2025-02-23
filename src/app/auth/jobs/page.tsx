import React from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import AddJob from "@/components/AddJob";
import { Input } from "@heroui/react";
import JobsTable from "@/components/JobsTable";

const JobsPage = async () => {
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
        <JobsTable />
      </div>
    </div>
  );
};

export default JobsPage;