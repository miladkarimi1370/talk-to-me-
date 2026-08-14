import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/app/lib/supabase";

export const { handlers: { GET, POST }, signIn, auth, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login", newUser: "/register" },

  providers: [

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", label: "email" },
        password: { type: "password", label: "password" }
      },
      async authorize(credentials) {

        if (!credentials) return null;


        const email = (credentials.email ?? "") as string;
        const password = (credentials.password ?? "") as string;


        if (!email || !password) return null;


        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", email)
          .single();


        if (error || !user) return null;
        if (!user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,

          name: user.full_name,
          image: user.avatar_url,

        };
      },
    })
  ],


  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        token.picture = user.image;
      }
      return token;

    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;

        session.user.image = token.picture as string;

      }
      return session;
    }
  }

});

