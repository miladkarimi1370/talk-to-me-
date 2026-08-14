import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
<<<<<<< HEAD
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/app/lib/supabase";

export const { handlers: { GET, POST }, signIn, auth, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login", newUser: "/register" },

  providers: [
=======

import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/app/lib/supabase";


export const { handlers: { GET, POST }, signIn, auth, signOut } = NextAuth({
  session: { strategy: "jwt" },

  pages: { signIn: "/login", newUser: "/register" },
  providers: [

>>>>>>> 292af5e (add complete project)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", label: "email" },
        password: { type: "password", label: "password" }
      },
      async authorize(credentials) {
<<<<<<< HEAD
        if (!credentials) return null;
=======


        if (!credentials) {
          console.log("ERROR: credentials is undefined/null");
          return null;
        }
>>>>>>> 292af5e (add complete project)

        const email = (credentials.email ?? "") as string;
        const password = (credentials.password ?? "") as string;

<<<<<<< HEAD
        if (!email || !password) return null;
=======


        if (!email || !password) {
          console.log("ERROR: email or password empty");
          return null;
        }


>>>>>>> 292af5e (add complete project)

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

<<<<<<< HEAD
        if (error || !user) return null;
        if (!user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
=======

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

>>>>>>> 292af5e (add complete project)

        return {
          id: user.id,
          email: user.email,
<<<<<<< HEAD
          name: user.full_name,
          image: user.avatar_url,
=======
          name: user.name,
          image: user.image,
>>>>>>> 292af5e (add complete project)
        };
      },
    })
  ],
<<<<<<< HEAD

=======
>>>>>>> 292af5e (add complete project)
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
<<<<<<< HEAD
        token.picture = user.image;
      }
      return token;
=======
      }
      return token
>>>>>>> 292af5e (add complete project)
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
<<<<<<< HEAD
        session.user.image = token.picture as string;
=======
>>>>>>> 292af5e (add complete project)
      }
      return session;
    }
  }
<<<<<<< HEAD
});
=======
})

>>>>>>> 292af5e (add complete project)
