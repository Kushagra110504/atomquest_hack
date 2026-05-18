import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Bulletproof fix for Vercel deployments: Automatically use the Vercel URL if present, overriding any bad localhost configs
if (process.env.VERCEL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
