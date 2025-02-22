import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function useNavUser(initialUser: User) {
  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleSignOut = async () => {
    await signOut();
  };

  return { user, handleSignOut };
}
