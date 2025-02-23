import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabaseClient";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ChatMessage = {
  role: string;
  message: string;
  time_in_call_secs: string; // added timestamp property
};

const InterviewInfoModal = ({
  applicantId,
  isDisabled,
}: {
  applicantId: number;
  isDisabled: boolean;
}) => {
  const [transcript, setTranscript] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = async () => {
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("applicant_id", applicantId)
        .single();

      console.log("Data:", data);
      if (error) {
        throw error;
      }

      setTranscript(data.transcript);
      setSummary(data.summary);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error loading transcript");
    }
  };

  // Parse transcript JSON into an array of chat messages
  const chatMessages: ChatMessage[] = useMemo(() => {
    try {
      console.log("Transcript:", transcript);
      return JSON.parse(transcript);
    } catch (e) {
      console.error("Error parsing transcript JSON:", e);
      return [];
    }
  }, [transcript]);

  return (
    <>
      <Button
        variant="ghost"
        className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
        onClick={handleButtonClick}
        disabled={isDisabled}
      >
        Interview data
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[50vw] max-w-fit overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Interview Transcript</SheetTitle>
            <SheetDescription>
              The transcript of the interview is below.
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-96 overflow-y-auto p-2 border rounded space-y-4">
            {chatMessages.length > 0 ? (
              chatMessages.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${
                    entry.role === "agent" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded max-w-xs ${
                      entry.role === "agent"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-green-100 text-green-900"
                    }`}
                  >
                    <p>{entry.message}</p>
                    <small className="block text-xs text-gray-600 mt-1">
                      time in call: {entry.time_in_call_secs}s
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
          </div>
          <SheetFooter className="flex justify-start mt-4">
            <SheetClose asChild>
              <Button>Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InterviewInfoModal;
