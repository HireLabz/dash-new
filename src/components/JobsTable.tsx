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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Trash2Icon } from "lucide-react";

interface SectionTag {
  section: string;
  context: string;
}

interface Job {
  id: number;
  job_name: string;
  job_description: string;
  section_description: string;
  status: boolean;
  sections?: SectionTag[];
}

interface JobsTableProps {
  globalFilter: string;
  jobNameFilter: string;
  statusFilter: string;
}

const JobsTable = ({
  globalFilter,
  jobNameFilter,
  statusFilter,
}: JobsTableProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Job | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      setError(error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const deleteJob = async (jobId: number) => {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (error) {
      setError(error);
    } else {
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Setup realtime subscription without a full refetch on changes.
    const channel = supabase
      .channel("jobs")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "jobs" },
        (payload) => {
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === (payload.new as Job).id ? (payload.new as Job) : job
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jobs" },
        (payload) => {
          setJobs((prevJobs) => [payload.new as Job, ...prevJobs]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "jobs" },
        (payload) => {
          setJobs((prevJobs) =>
            prevJobs.filter((job) => job.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const copyJobLink = (jobId: number) => {
    const link = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const updateJobStatus = async (job: Job, newStatus: boolean) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", job.id);
    if (error) {
      alert("Error updating job status.");
      return;
    }
    // Optimistically update local state.
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs.</div>;

  // Apply filters using the props
  const filteredJobs = jobs.filter((job) => {
    const name = job.job_name.toLowerCase();
    const description = job.job_description.toLowerCase();
    const section = job.section_description.toLowerCase();
    const statusText = job.status ? "active" : "inactive";
    const global = globalFilter.toLowerCase();

    const matchGlobal =
      !global ||
      name.includes(global) ||
      description.includes(global) ||
      section.includes(global) ||
      statusText.includes(global);
    const matchName = name.includes(jobNameFilter.toLowerCase());
    const matchStatus = statusText.includes(statusFilter.toLowerCase());

    return matchGlobal && matchName && matchStatus;
  });

  return (
    <>
      <Table>
        <TableCaption>A list of jobs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Section Description</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.job_name}</TableCell>
              <TableCell>{job.job_description}</TableCell>
              <TableCell>{job.section_description}</TableCell>
              <TableCell>
                {/* Render tags if they exist */}
                {job.sections && job.sections.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.sections.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
                        title={tag.context}
                      >
                        {tag.section}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <button
                      className="focus:outline-none"
                      title="Click to change status"
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          job.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-2 space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateJobStatus(job, true)}
                        className="w-full text-left"
                      >
                        Active
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateJobStatus(job, false)}
                        className="w-full text-left"
                      >
                        Inactive
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyJobLink(job.id)}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCandidate(job)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {deleteCandidate && (
        <Modal isOpen={true} onClose={() => setDeleteCandidate(null)}>
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              Are you sure you want to delete the job &quot;
              {deleteCandidate.job_name}&quot;?
            </ModalBody>
            <ModalFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteJob(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default JobsTable;
