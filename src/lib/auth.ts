import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createPureClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const supabase = await createPureClient();

        const { data: user, error } = await supabase
          .from("users")
          .select("id, username, password, email")
          .eq("username", credentials.username)
          .maybeSingle();

        if (error || !user) {
          return null;
        }

        const hashedPassword = hashPassword(credentials.password);
        if (user.password !== hashedPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
