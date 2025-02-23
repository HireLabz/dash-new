"use client";
import ApplicantsTable from "@/components/ApplicantsTable";
import React from "react";

const ApplicantsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Applications</h1>
        </div>
      </nav>

      {/* Applicants Table */}
      <div className="max-w-7xl mx-auto p-4">
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default ApplicantsPage;