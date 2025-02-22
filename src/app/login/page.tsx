"use client"
import { Button, Card } from "@heroui/react";
import { signIn } from "next-auth/react";
import React from "react";

const LoginPage = () => {
  const handleGoogleSignIn = React.useCallback(() => {
    signIn("google", { callbackUrl: "/auth" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="p-8">
        <h1 className="text-xl text-center mb-4">Login</h1>
        <Button variant="flat" onPress={handleGoogleSignIn}>
          Sign In with Google
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;