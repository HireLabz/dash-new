"use client"
import { Button } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const AuthPage = () => {

  const session = useSession();

  const handleSignOut = React.useCallback(() => {
    signOut();
  }, []);
  return (
    <div>
      <h1>Auth Page</h1>
      <p>This is the authentication page.</p>
    </div>
  );
};

export default AuthPage;
