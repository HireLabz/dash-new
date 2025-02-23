import { Account, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      email,
    }: {
      user: AdapterUser | User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
    }): Promise<boolean> {
      const allowedEmails = ["dacs2012@gmail.com", "itamardprf@gmail.com"];
      return allowedEmails.includes(email?.verificationRequest ? "" : (user.email ?? "")) || false;
    },
  },
};