import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./database";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}
function getGithubCredentials() {
  const clientId = process.env.GITHUB_ID as string;
  const clientSecret = process.env.GITHUB_SECRET as string;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GITHUB_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GITHUB_SECRET");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: getGithubCredentials().clientId,
      clientSecret: getGithubCredentials().clientSecret,
    }),
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        //@ts-ignore
        session.user.image = token.image;
      }

      return session;
    },

    redirect() {
      return "/dashboard";
    },
  },
};
