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

  return (
    <Table>
      <TableCaption>A list of job applications.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Job Position</TableHead>
          <TableHead>Candidate name</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Links</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.map((applicant) => (
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
                    onClick={() => window.open(applicant.github_url!, "_blank")}
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
  );
};

export default ApplicantsTable;