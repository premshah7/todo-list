'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/reports/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch stats')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            </div>
        )
    }

    const COLORS = ['#f59e0b', '#3b82f6', '#10b981']

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Visualize your team's performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Status Distribution</CardTitle>
                        <CardDescription>Tasks by status across all projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.statusDistribution && (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.statusDistribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Priority Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Priority Distribution</CardTitle>
                        <CardDescription>Tasks by priority level</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.priorityDistribution && (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.priorityDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Project Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Projects Overview</CardTitle>
                        <CardDescription>Active projects and task counts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.projectStats && (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.projectStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="tasks" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Team Workload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Workload</CardTitle>
                        <CardDescription>Tasks assigned per team member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.userWorkload && (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.userWorkload}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="tasks" fill="#f59e0b" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
