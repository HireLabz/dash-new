"use client";
import React, { useState } from "react";
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

type SectionTag = {
  section: string;
  context: string;
};

const AddJob = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState<
    "auto" | "center" | "top" | "top-center" | "bottom" | "bottom-center"
  >("auto");

  // State for tag selection
  const [selectedTags, setSelectedTags] = useState<SectionTag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sectionContext, setSectionContext] = useState("");

  const addTag = (tag: SectionTag) => {
    setSelectedTags([...selectedTags, tag]);
    setTagInput("");
    setSectionContext("");
  };

  const addCustomTag = () => {
    if (tagInput.trim() !== "") {
      const newTag: SectionTag = { section: tagInput, context: sectionContext };
      addTag(newTag);
    }
  };

  const removeTag = (section: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.section !== section));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const job_name = formData.get("jobTitle")?.toString() || "";
    const job_description = formData.get("jobDescription")?.toString() || "";
    const statusStr = formData.get("status")?.toString() || "inactive";
    const section_description =
      formData.get("section_description")?.toString() || "";
    const status = statusStr === "active";

    const { error } = await supabase
      .from("jobs")
      .insert([
        {
          job_name,
          job_description,
          status,
          sections: selectedTags,
          section_description,
        },
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

  const handleClose = () => {
    setTagInput("");
    setSelectedTags([]);
    setSectionContext("");
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
        onClose={handleClose}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalHeader className="flex flex-col gap-1">Add job</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 mb-4">
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
                <div className="flex flex-col gap-2 mb-4">
                  <label
                    htmlFor="jobDescription"
                    className="text-sm font-medium"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    className="border rounded p-2"
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2 mb-4">
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
                <div className="flex flex-col gap-2 mb-4">
                  <label htmlFor="sections" className="text-sm font-medium">
                    Must ask
                  </label>
                  <input
                    type="text"
                    id="section_description"
                    name="section_description"
                    className="border rounded p-2"
                    required
                  />
                </div>
                {/* Tag Selector for Section Descriptions */}
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm font-medium">Section Tags</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add a section tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomTag();
                        }
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Context for the tag"
                    value={sectionContext}
                    onChange={(e) => setSectionContext(e.target.value)}
                    className="border rounded p-2 w-full mt-2"
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={addCustomTag}
                  >
                    Add Tag
                  </Button>
                  {/* Display selected tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag.section}
                        className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 inline-flex items-center"
                        title={tag.context}
                      >
                        <span>{tag.section}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag.section)}
                          className="ml-2 focus:outline-none"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
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
