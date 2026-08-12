// components/RegisterComponent.tsx
"use client";

import { useForm } from "react-hook-form";
import { RegisterInput, RegisterSchema } from "../lib/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { registerUser } from "../lib/actions/auth";

export default function RegisterComponent() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError("");

        try {
            const result = await registerUser(data);

            if (result?.error) {
                setError(result.error);
            } else {
                // ثبت‌نام و لاگین موفق → ریدایرکت به چت
                router.push("/chat");
                router.refresh();
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("خطای غیرمنتظره رخ داد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-screen h-screen flex flex-wrap justify-center gap-5 bg-background">
            {/* لوگو و عنوان */}
            <div className="w-full flex justify-center items-end pt-10">
                <div className="flex justify-center items-center gap-3">
                    <Image
                        src="/diagram.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-3xl font-bold text-center text-primary capitalize">
                        Register
                    </h1>
                </div>
            </div>

            {/* فرم */}
            <div className="flex justify-center items-start w-full">
                <div className="w-full max-w-md mx-auto p-4">
                    {error && (
                        <div className="mb-4 text-red-500 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-primary font-bold mb-1.5"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                {...register("fullName")}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="John Doe"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-primary font-bold mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="test@test.com"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-primary font-bold mb-1.5"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password")}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* دکمه ثبت‌نام */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-3xl font-bold text-white bg-primary hover:bg-primary-hover duration-300 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    در حال ثبت‌نام...
                                </>
                            ) : (
                                "ثبت‌نام"
                            )}
                        </button>
                    </form>

                    {/* لینک به صفحه لاگین */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Do you have an account ? {" "}
                        <Link
                            href="/login"
                            className="text-primary font-medium hover:underline"
                        >
                            login page
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}