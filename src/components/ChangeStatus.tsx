"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChangeStatusProps {
  jobId: number;
  currentStatus: boolean;
}

const ChangeStatus: React.FC<ChangeStatusProps> = ({ jobId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = async (newStatus: boolean) => {
    setStatus(newStatus);

    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={status ? "default" : "secondary"}
          className={cn(
            "min-w-[100px]",
            status
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          )}
        >
          {status ? "Active" : "Inactive"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onClick={() => handleChange(true)}
          className="text-green-600 focus:text-green-600 focus:bg-green-50"
        >
          Active
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChange(false)}
          className="text-gray-600 focus:text-gray-600 focus:bg-gray-50"
        >
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeStatus;