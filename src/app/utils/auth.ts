import { Account, Profile, SessionStrategy, User } from "next-auth";
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
      account,
      profile,
      email,
      credentials,
    }: {
      user: AdapterUser | User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, any>;
    }): Promise<boolean> {
      const allowedEmails = ["dacs2012@gmail.com", "itamardprf@gmail.com"];
      return allowedEmails.includes(email?.verificationRequest ? "" : (user.email ?? "")) || false;
    },
  },
};
