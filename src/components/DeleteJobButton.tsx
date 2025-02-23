"use client";
import React from "react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Trash2Icon } from "lucide-react";

interface DeleteJobButtonProps {
  jobId: number;
}

const DeleteJobButton: React.FC<DeleteJobButtonProps> = ({ jobId }) => {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Button variant='ghost' onClick={handleDelete}>
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
};

export default DeleteJobButton;