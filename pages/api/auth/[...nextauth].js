import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/connect";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Benutzername",
          type: "text",
          placeholder: "Benutzername",
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        /*  TODO: Remove for Release */
        if (
          process.env.VERCEL_ENV === "preview" &&
          credentials.username === "preview" &&
          credentials.password === "preview"
        ) {
          return { id: "preview", name: "preview" };
        }
        /* -------------------------- */

        await dbConnect();

        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
};

export default NextAuth(authOptions);
