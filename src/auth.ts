import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { verifyUserCredentials } from "@/lib/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    GitHub,
    Apple,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await verifyUserCredentials(credentials.email as string, credentials.password as string);
        if (!user) return null;
        return user;
      }
    })
  ],
  callbacks: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'STUDENT';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.sub as string;
      }
      return session;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
})
