"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, ArrowRight, FolderKanban } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <div className="flex min-h-screen bg-white dark:bg-black">
            {/* Left Side - Visual / Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between p-12 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
                        <FolderKanban size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Project Manager</span>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                        Master your project operations.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Join thousands of managers and teams using Project Manager to minimize delays and maximize productivity.
                    </p>
                </div>

                <div className="relative z-10 p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm">
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-full bg-zinc-700 flex-shrink-0"></div>
                        <div className="space-y-2">
                            <div className="h-2 w-24 bg-zinc-600 rounded"></div>
                            <div className="h-2 w-48 bg-zinc-700 rounded"></div>
                            <div className="h-2 w-32 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <div className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">IN PROGRESS</div>
                        <div className="px-2 py-1 rounded bg-zinc-700 text-zinc-400 text-xs font-bold border border-zinc-600">HIGH PRIORITY</div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Sign in</h2>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Welcome back to your workspace</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-900 dark:text-zinc-100">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="h-11 bg-white dark:bg-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-900 dark:text-zinc-100">Password</Label>
                                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-11 bg-white dark:bg-black"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Don't have an account? </span>
                        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Create free account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
