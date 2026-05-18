import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      managerId: string | null;
      department: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    managerId: string | null;
    department: string | null;
  }
}
