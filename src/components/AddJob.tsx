"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const AddJob = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = React.useState<
    "auto" | "center" | "top" | "top-center" | "bottom" | "bottom-center"
  >("auto");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const job_name = formData.get("jobTitle")?.toString() || "";
    const job_description = formData.get("jobDescription")?.toString() || "";
    const section_description =
      formData.get("sectionDescription")?.toString() || "";
    const statusStr = formData.get("status")?.toString() || "inactive";
    const status = statusStr === "active";

    const { error } = await supabase.from("jobs").insert([
      { job_name, job_description, section_description, status },
    ]);

    if (error) {
      console.error("Error adding job:", error);
      // Optionally display an error message to your user
    } else {
      onClose(); // Close modal on success
      // Dispatch a custom event to inform that a job was added
      window.dispatchEvent(new Event("job-updated"));
    }
  };

  return (
    <div>
      <Button variant="default" onClick={onOpen}>
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Job
      </Button>

      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}
        closeButton={false}
        autoFocus={false}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalHeader className="flex flex-col gap-1">Add job</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="border rounded p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jobDescription" className="text-sm font-medium">
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    className="border rounded p-2"
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="sectionDescription" className="text-sm font-medium">
                    Section Description
                  </label>
                  <textarea
                    id="sectionDescription"
                    name="sectionDescription"
                    className="border rounded p-2"
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="border rounded p-2"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddJob;