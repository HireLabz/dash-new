"use client"
import React, { useState } from "react";

const TextPage = () => {
  const [phone, setPhone] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/send-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setResponseMsg("Phone sent successfully!");
    } catch (error) {
      console.error("Error sending phone:", error);
      setResponseMsg("Error sending phone.");
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <p>This is a test page.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
};

export default TextPage;