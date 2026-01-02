"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, FolderKanban, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const fullname = formData.get("name") as string;
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const department = formData.get("department") as string;
        const role = formData.get("role") as string;

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, username, email, password, department, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // Redirect to Queue Page
            if (data.queueID) {
                router.push(`/auth/queue?queueID=${data.queueID}`);
            } else if (data.redirectTo) {
                router.push(data.redirectTo);
            } else {
                router.push("/auth/queue");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-white dark:bg-black">
            {/* Left Side - Visual / Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-950 flex-col justify-between p-12 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#818cf8_1px,transparent_1px),linear-gradient(to_bottom,#818cf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-900 shadow-lg">
                        <FolderKanban size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Project Manager</span>
                </div>

                <div className="relative z-10 space-y-8 max-w-lg">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
                            Start your project management journey.
                        </h1>
                        <p className="text-indigo-200 text-lg">
                            Get full visibility into your projects, tasks, and team performance in minutes.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Track real-time project progress",
                            "Auto-assign tasks to team members",
                            "Visualize workflow with Kanban boards"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-indigo-300/60 font-mono">
                    PROJECT EXCELLENCE PLATFORM v2.0
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create account</h2>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Set up your workspace in seconds.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required className="h-11 bg-white dark:bg-black" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" placeholder="johndoe" required className="h-11 bg-white dark:bg-black" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="name@company.com" required className="h-11 bg-white dark:bg-black" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required className="h-11 bg-white dark:bg-black" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">Department (Optional)</Label>
                            <Input id="department" name="department" placeholder="Engineering" className="h-11 bg-white dark:bg-black" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">I am a...</Label>
                            <Select name="role" defaultValue="USER">
                                <SelectTrigger className="h-11 bg-white dark:bg-black">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">Team Member (User)</SelectItem>
                                    <SelectItem value="MANAGER">Project Manager</SelectItem>
                                    <SelectItem value="ADMIN">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit for Approval <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Already have an account? </span>
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
