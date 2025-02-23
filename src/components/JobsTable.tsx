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
import DeleteJobButton from "./DeleteJobButton";
import { PostgrestError } from "@supabase/supabase-js";
import ChangeStatus from "./ChangeStatus";
import { Button } from "./ui/button";
import { Link2Icon } from "lucide-react";

interface Job {
  id: number;
  job_name: string;
  job_description: string;
  section_description: string;
  status: boolean;
}

const JobsTable = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("jobs").select("*").order("id", { ascending: true });
    if (error) {
      setError(error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
    
    const channel = supabase
      .channel('jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        (payload) => {
          console.log('Change received!', payload);
          
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              setJobs(current => [...current, payload.new as Job]);
              break;
            case 'UPDATE':
              setJobs(current => 
                current.map(job => 
                  job.id === payload.new.id ? payload.new as Job : job
                )
              );
              break;
            case 'DELETE':
              setJobs(current => 
                current.filter(job => job.id !== payload.old.id)
              );
              break;
          }
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
    // Optional: Add toast notification here
    alert("Link copied to clipboard!");
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs.</div>;

  return (
    <Table>
      <TableCaption>A list of jobs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job: Job) => (
          <TableRow key={job.id}>
            <TableCell>{job.job_name}</TableCell>
            <TableCell>{job.job_description}</TableCell>
            <TableCell>{job.section_description}</TableCell>
            <TableCell>
              <ChangeStatus jobId={job.id} currentStatus={job.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyJobLink(job.id)}
                  className="flex items-center gap-1"
                >
                  <Link2Icon className="h-4 w-4" />
                  Copy Link
                </Button>
                <DeleteJobButton jobId={job.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default JobsTable;