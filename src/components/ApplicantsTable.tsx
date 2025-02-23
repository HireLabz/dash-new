"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PostgrestError } from "@supabase/supabase-js";
import { FileIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  job_id: number;
  resume_url: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  created_at: string;
  job: {
    job_name: string;
  };
}

const ApplicantsTable = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  // Filter states
  const [globalFilter, setGlobalFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [candidateFilter, setCandidateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchApplicants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applicants")
      .select(`
        *,
        job:jobs(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error);
      console.error("Error fetching applicants:", error);
    } else {
      setApplicants(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicants();

    const channel = supabase
      .channel("applicants")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applicants" },
        (payload) => {
          fetchApplicants(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error loading applications.</div>;

  // Apply filters
  const filteredApplicants = applicants.filter((applicant) => {
    const jobName = applicant.job?.job_name.toLowerCase() || "";
    const candidateName = `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
    const statusText = applicant.status.toLowerCase();
    const global = globalFilter.toLowerCase();

    const matchGlobal =
      !global ||
      jobName.includes(global) ||
      candidateName.includes(global) ||
      statusText.includes(global);
    const matchJob = jobName.includes(jobFilter.toLowerCase());
    const matchCandidate = candidateName.includes(candidateFilter.toLowerCase());
    const matchStatus = statusText.includes(statusFilter.toLowerCase());

    return matchGlobal && matchJob && matchCandidate && matchStatus;
  });

  return (
    <>
      {/* Global Semantic Search */}
      <div className="mb-4 max-w-7xl mx-auto px-4">
        <input
          type="text"
          placeholder="Semantic Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <Table>
        <TableCaption>A list of job applications.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Position</TableHead>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
          </TableRow>
          {/* Filters Row */}
          <TableRow>
            <TableCell>
              <input
                type="text"
                placeholder="Filter job..."
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="border rounded p-1 w-full text-sm"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                placeholder="Filter candidate..."
                value={candidateFilter}
                onChange={(e) => setCandidateFilter(e.target.value)}
                className="border rounded p-1 w-full text-sm"
              />
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <input
                type="text"
                placeholder="Filter status..."
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded p-1 w-full text-sm"
              />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.job?.job_name}</TableCell>
              <TableCell>
                {applicant.first_name} {applicant.last_name}
              </TableCell>
              <TableCell>
                {applicant.resume_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(applicant.resume_url, "_blank")}
                    className="flex items-center gap-1"
                  >
                    <FileIcon className="h-4 w-4" />
                    View Resume
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {applicant.linkedin_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(applicant.linkedin_url!, "_blank")
                      }
                      title="LinkedIn Profile"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  )}
                  {applicant.portfolio_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(applicant.portfolio_url!, "_blank")
                      }
                      title="Portfolio"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Portfolio
                    </Button>
                  )}
                  {applicant.github_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(applicant.github_url!, "_blank")
                      }
                      title="GitHub Profile"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      GitHub
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    {
                      pending: "bg-yellow-100 text-yellow-800",
                      reviewing: "bg-blue-100 text-blue-800",
                      accepted: "bg-green-100 text-green-800",
                      rejected: "bg-red-100 text-red-800",
                    }[applicant.status]
                  }`}
                >
                  {applicant.status.charAt(0).toUpperCase() +
                    applicant.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(applicant.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ApplicantsTable;