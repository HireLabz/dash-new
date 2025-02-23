"use client";
import { PlaneIcon, Loader2, } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

interface Job {
  id: number;
  job_name: string;
  job_description: string;
  section_description: string;
  status: boolean;
}

export default function JobForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const jobId = params.jobId as string;

  useEffect(() => {
    if (!jobId) return;

    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        setError("Error fetching job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      let resumeUrl = "";
      if (resume) {
        // Handle file upload to Supabase storage
        const fileExt = resume.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // Upload file
        const { error: uploadError, data } = await supabase.storage
          .from("applicants resume")
          .upload(fileName, resume);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          throw uploadError;
        }

        // Get the public URL of the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from("applicants resume").getPublicUrl(fileName);

        resumeUrl = publicUrl;
      }

      // Insert application into the applicants table with the public URL
      const { error: insertError } = await supabase.from("applicants").insert([
        {
          job_id: jobId,
          resume_url: resumeUrl, // Store the public URL instead of just the filename
          linkedin_url: linkedin,
          portfolio_url: portfolio,
          github_url: github,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Error submitting application. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" /> Retrieving job details...
      </div>
    );
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!job) return <div className="p-8">Job not found</div>;
  if (submitted)
    return (
      <div className="container mx-auto py-8">
        <Card shadow="none" className="max-w-4xl mx-auto bg-transparent">
          <CardHeader>
            <h1 className="text-3xl font-bold">Application Submitted!</h1>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Thank you for applying. We will get back to you soon.
            </p>
          </CardBody>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <Card shadow="none" className="max-w-4xl mx-auto bg-transparent">
        <CardHeader>
          <div className="flex flex-col justify-between">
            <h1 className="text-3xl font-bold">{job.job_name}</h1>
            <p className="text-gray-600">{job.job_description}</p>
          </div>
        </CardHeader>
        <CardBody>
          {!job.status ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
              This position is no longer accepting applications.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold">Apply for this position</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      e.target.files && setResume(e.target.files[0])
                    }
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    disabled={submitLoading}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="123-456-7890"
                  disabled={submitLoading}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlaneIcon className="mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </CardBody>
        <CardFooter>
          <div className="flex flex-col">
            <p className="text-gray-600">
              By submitting your application, you agree to our{" "}
              <a href="/terms" className="text-blue-500 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500 underline">
                Privacy Policy
              </a>
            </p>
            <p className="text-gray-600">Powerd by HireLabz</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
