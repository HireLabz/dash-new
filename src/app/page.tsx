import { Button } from "@heroui/react";
import Image from "next/image";

export default function Home() {
  // use hero ui components and tailwind css here
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <p className="mt-4 text-lg">Welcome to my Next.js app with Hero UI!</p>
      <Image
        src="/hero-ui-logo.png"
        alt="Hero UI Logo"
        width={150}
        height={150}
      />
      <Button variant="flat" className="mt-4">
        Click Me
      </Button>
    </main>
  );
}
