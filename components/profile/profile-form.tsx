"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { updateProfile } from "@/actions/profile"
import { Loader2 } from "lucide-react"

// Schema matching the server action validation
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(500).optional(),
    // Admin
    jobTitle: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    timezone: z.string().max(50).optional(),
    // Manager
    teamName: z.string().max(100).optional(),
    designation: z.string().max(100).optional(),
    // User
    skills: z.string().max(500).optional(),
    workHours: z.string().max(100).optional(),
    // Preferences
    emailNotifications: z.boolean(),
    theme: z.string(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
    user: {
        name: string
        email: string
        role: string
    }
    profile: any // Typed as any for now to simplify initial bind
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()

    const defaultValues: ProfileFormValues = {
        name: user.name,
        email: user.email,
        bio: profile?.Bio || "",
        jobTitle: profile?.JobTitle || "",
        department: profile?.Department || "",
        timezone: profile?.Timezone || "",
        teamName: profile?.TeamName || "",
        designation: profile?.Designation || "",
        skills: profile?.Skills || "",
        workHours: profile?.WorkHours || "",
        emailNotifications: !!(profile?.EmailNotifications ?? true),
        theme: profile?.Theme || "system",
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    })

    function onSubmit(data: ProfileFormValues) {
        startTransition(async () => {
            try {
                await updateProfile(data)
                toast.success("Profile updated successfully")
            } catch (error) {
                toast.error("Failed to update profile")
            }
        })
    }

    const role = user.role.toUpperCase()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Account Info (Read Only / Basic) */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your core identity in the system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input {...form.register("name")} placeholder="John Doe" />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input {...form.register("email")} placeholder="john@example.com" />
                            {form.formState.errors.email && (
                                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            placeholder="Tell us a little about yourself"
                            {...form.register("bio")}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Role Specific Fields */}
            {role === "ADMIN" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-500">Admin Details</CardTitle>
                        <CardDescription>Configuration for system administrators.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input {...form.register("jobTitle")} placeholder="e.g. Senior DevOps Engineer" />
                            </div>
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Input {...form.register("department")} placeholder="e.g. IT / Engineering" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Input {...form.register("timezone")} placeholder="e.g. UTC-5" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {role === "MANAGER" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-purple-500">Manager Settings</CardTitle>
                        <CardDescription>Manage your team presence.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Team Name</Label>
                            <Input {...form.register("teamName")} placeholder="e.g. Alpha Squad" />
                        </div>
                        <div className="space-y-2">
                            <Label>Designation</Label>
                            <Input {...form.register("designation")} placeholder="e.g. Tech Lead" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {role === "USER" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-500">Member Details</CardTitle>
                        <CardDescription>Showcase your skills and availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Skills (Comma tags)</Label>
                            <Input {...form.register("skills")} placeholder="React, Node.js, Design..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Preferred Work Hours</Label>
                            <Input {...form.register("workHours")} placeholder="9:00 AM - 5:00 PM" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <div className="text-sm text-muted-foreground">
                                Receive emails about task updates.
                            </div>
                        </div>
                        <Switch
                            checked={form.watch("emailNotifications")}
                            onCheckedChange={(checked) => form.setValue("emailNotifications", checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Theme Preference</Label>
                        <Select
                            onValueChange={(val) => form.setValue("theme", val)}
                            defaultValue={form.watch("theme")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="System" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending} className="ml-auto min-w-[150px]">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
