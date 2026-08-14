<<<<<<< HEAD
=======
// components/RegisterComponent.tsx
>>>>>>> 292af5e (add complete project)
"use client";

import { useForm } from "react-hook-form";
import { RegisterInput, RegisterSchema } from "../lib/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
=======

>>>>>>> 292af5e (add complete project)
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
<<<<<<< HEAD
        defaultValues: {
            avatar_url: "",
            bio: "",
        },
=======
>>>>>>> 292af5e (add complete project)
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError("");

        try {
            const result = await registerUser(data);

            if (result?.error) {
                setError(result.error);
            } else {
<<<<<<< HEAD
=======
                // ثبت‌نام و لاگین موفق → ریدایرکت به چت
>>>>>>> 292af5e (add complete project)
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
<<<<<<< HEAD
            <div className="w-full flex justify-center items-end pt-10">
                <div className="flex justify-center items-center gap-3">
                    <Image src="/diagram.svg" alt="logo" width={40} height={40} />
=======
            {/* لوگو و عنوان */}
            <div className="w-full flex justify-center items-end pt-10">
                <div className="flex justify-center items-center gap-3">
                    <Image
                        src="/diagram.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
>>>>>>> 292af5e (add complete project)
                    <h1 className="text-3xl font-bold text-center text-primary capitalize">
                        Register
                    </h1>
                </div>
            </div>

<<<<<<< HEAD
=======
            {/* فرم */}
>>>>>>> 292af5e (add complete project)
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
<<<<<<< HEAD
                            <label htmlFor="fullName" className="block text-primary font-bold mb-1.5">
=======
                            <label
                                htmlFor="fullName"
                                className="block text-primary font-bold mb-1.5"
                            >
>>>>>>> 292af5e (add complete project)
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
<<<<<<< HEAD
                                {...register("full_name")}
=======
                                {...register("fullName")}
>>>>>>> 292af5e (add complete project)
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="John Doe"
                            />
<<<<<<< HEAD
                            {errors.full_name && (
                                <p className="text-xs text-red-500 mt-1.5">{errors.full_name.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-primary font-bold mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username")}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="john_doe"
                            />
                            {errors.username && (
                                <p className="text-xs text-red-500 mt-1.5">{errors.username.message}</p>
=======
                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.fullName.message}
                                </p>
>>>>>>> 292af5e (add complete project)
                            )}
                        </div>

                        {/* Email */}
                        <div>
<<<<<<< HEAD
                            <label htmlFor="email" className="block text-primary font-bold mb-1.5">
=======
                            <label
                                htmlFor="email"
                                className="block text-primary font-bold mb-1.5"
                            >
>>>>>>> 292af5e (add complete project)
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
<<<<<<< HEAD
                                <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
=======
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.email.message}
                                </p>
>>>>>>> 292af5e (add complete project)
                            )}
                        </div>

                        {/* Password */}
                        <div>
<<<<<<< HEAD
                            <label htmlFor="password" className="block text-primary font-bold mb-1.5">
=======
                            <label
                                htmlFor="password"
                                className="block text-primary font-bold mb-1.5"
                            >
>>>>>>> 292af5e (add complete project)
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
<<<<<<< HEAD
                                <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Avatar URL (optional) */}
                        <div>
                            <label htmlFor="avatar_url" className="block text-primary font-bold mb-1.5">
                                Avatar URL <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                id="avatar_url"
                                {...register("avatar_url")}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors"
                                disabled={isLoading}
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {errors.avatar_url && (
                                <p className="text-xs text-red-500 mt-1.5">{errors.avatar_url.message}</p>
                            )}
                        </div>

                        {/* Bio (optional) */}
                        <div>
                            <label htmlFor="bio" className="block text-primary font-bold mb-1.5">
                                Bio <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <textarea
                                id="bio"
                                {...register("bio")}
                                rows={3}
                                className="border-2 border-border rounded-3xl w-full p-3 bg-transparent outline-none focus:border-primary transition-colors resize-none"
                                disabled={isLoading}
                                placeholder="Tell us about yourself..."
                            />
                            {errors.bio && (
                                <p className="text-xs text-red-500 mt-1.5">{errors.bio.message}</p>
                            )}
                        </div>

=======
                                <p className="text-xs text-red-500 mt-1.5">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* دکمه ثبت‌نام */}
>>>>>>> 292af5e (add complete project)
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-3xl font-bold text-white bg-primary hover:bg-primary-hover duration-300 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
<<<<<<< HEAD
                                    Signing UP
                                </>
                            ) : (
                                "Sign Up"
=======
                                    در حال ثبت‌نام...
                                </>
                            ) : (
                                "ثبت‌نام"
>>>>>>> 292af5e (add complete project)
                            )}
                        </button>
                    </form>

<<<<<<< HEAD
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Do you have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
=======
                    {/* لینک به صفحه لاگین */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Do you have an account ? {" "}
                        <Link
                            href="/login"
                            className="text-primary font-medium hover:underline"
                        >
>>>>>>> 292af5e (add complete project)
                            login page
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}