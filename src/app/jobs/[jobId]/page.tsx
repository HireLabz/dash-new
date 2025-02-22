"use client";

import { PlaneIcon } from "lucide-react";
import { useState } from "react";

export default function JobForm({ jobId }: { jobId: string }) {
  const [resume, setResume] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("jobId", jobId);
    if (resume) {
      formData.append("resume", resume);
    }
    formData.append("linkedin", linkedin);
    formData.append("portfolio", portfolio);
    formData.append("github", github);

    // Example: submit form data to the API endpoint
    await fetch("/api/apply", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Apply for Job {jobId}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          onChange={(e) => e.target.files && setResume(e.target.files[0])}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">LinkedIn</label>
        <input
          type="url"
          placeholder="https://www.linkedin.com/in/your-profile"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Portfolio</label>
        <input
          type="url"
          placeholder="https://yourportfolio.com"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">GitHub</label>
        <input
          type="url"
          placeholder="https://github.com/your-username"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        <PlaneIcon className="mr-2" />
        Submit Application
      </button>
    </form>
  );
}