"use client";
import React from "react";
import { Card, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Button } from "./ui/button";
import { PlusIcon, XIcon } from "lucide-react";

const AddJob = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const [modalPlacement, setModalPlacement] = React.useState<"auto" | "center" | "top" | "top-center" | "bottom" | "bottom-center">("auto");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle submit to add job to db
  };

  return (
    <div>
      <Button variant="default" onClick={onOpen}>
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Job
      </Button>

      <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange} closeButton={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add job</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
                    <input type="text" id="jobTitle" name="jobTitle" className="border rounded p-2" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="jobDescription" className="text-sm font-medium">Job Description</label>
                    <textarea id="jobDescription" name="jobDescription" className="border rounded p-2" required></textarea>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={onClose}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddJob;