// components/LoginComponent.tsx
"use client";

import { useForm } from "react-hook-form";
import { LoginInput, LoginSchema } from "../lib/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginComponent() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        window.location.href = "/chat";
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-screen h-screen flex flex-wrap justify-center gap-5">
      <div className="w-full flex justify-center items-end">
        <div className="flex justify-center items-center gap-3">
          <Image src="/diagram.svg" alt="logo" width={40} height={40} />
          <h1 className="text-3xl font-bold text-center text-primary capitalize">
            login
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-start w-full relative">
        {error && (
          <div className="text-red-500 font-bold text-center p-2 bg-red-50 rounded top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-4 space-y-4"
          autoComplete=""
        >
          <div>
            <label htmlFor="email" className="text-primary font-bold">
              Email :{" "}
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="border-2 border-border rounded-3xl w-full p-2"
              disabled={isLoading}
              placeholder="test@test.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-primary font-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="border-2 border-border rounded-3xl w-full p-2 text-text-primary"
              disabled={isLoading}
              placeholder="123456"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg font-bold text-white hover:text-background duration-500 transition-colors cursor-pointer hover:bg-primary-hover flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>

          {/* ⬇️ لینک ثبت‌نام اضافه شد */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}