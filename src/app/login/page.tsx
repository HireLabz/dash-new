"use client";
import { WarpBackground } from "@/components/magicui/warp-background";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Spade } from "lucide-react";
import { signIn } from "next-auth/react";
import React from "react";

const LoginPage = () => {
  const handleGoogleSignIn = React.useCallback(() => {
    signIn("google", { callbackUrl: "/auth" });
  }, []);

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <WarpBackground>
        <Card className="p-8">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="flex flex-row items-center mb-4">
              <Spade className="h-12 w-12 text-gray-900 mb-4" />
              <h1 className="text-3xl font-bold mb-2">Hire Labz</h1>
            </div>
            <p className="text-gray-600">Please sign in to your account</p>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            <Button variant="flat" onPress={handleGoogleSignIn}>
              Sign In with Google
            </Button>
          </CardBody>
        </Card>
        </WarpBackground>
      </div>
  );
};

export default LoginPage;
