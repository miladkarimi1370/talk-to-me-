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


        if (!credentials) {
          console.log("ERROR: credentials is undefined/null");
          return null;
        }

        const email = (credentials.email ?? "") as string;
        const password = (credentials.password ?? "") as string;



        if (!email || !password) {
          console.log("ERROR: email or password empty");
          return null;
        }



        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", email)
          .single();


        if (error) {
          console.log("ERROR: Supabase query failed");
          return null;
        }

        if (!user) {
          console.log("ERROR: No user found with this email");
          return null;
        }

        if (!user.password) {
          console.log("ERROR: User found but has no password field");
          return null;
        }



        const isValid = await bcrypt.compare(password, user.password);


        if (!isValid) {

          return null;
        }


        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  }
})

