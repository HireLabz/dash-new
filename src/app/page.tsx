"use client";

import Background from "@/components/eldoraui/novatrixbg";
import { Button } from "@heroui/react";
import { SpadeIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const handleGetStarted = () => {
    redirect("/login");
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <Background />
      </div>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-transparent px-6 py-12">
        {/* Hero section */}
        <div className="w-full max-w-3xl text-center relative">
          <div className="flex flex-row items-center justify-center mb-8">
            <SpadeIcon className="h-16 w-16 text-gray-900 mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              HireLabz
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Streamline your candidate screening with automated AI interview
            calls and tailored analytics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={handleGetStarted}
              className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              variant="flat"
              size="lg"
              onPress={() => alert("Learn More clicked")}
              className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
            >
              Learn More
            </Button>
          </div>
        </div>
        <footer className="mt-12 text-sm text-gray-500 relative">
          © {new Date().getFullYear()} HireLabz. All rights reserved.
        </footer>
      </main>
    </>
  );
}
