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
      {session.data?.user?.email}
      <h1>Auth Page</h1>
      <p>This is the authentication page.</p>
      <Button
        variant="flat"
        className="mt-4"
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default AuthPage;
