"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

interface StatusDoughnutProps {
    data: {
        name: string
        value: number
        color: string
    }[]
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1c1c1c] border border-white/10 p-2 rounded-lg shadow-xl">
                <p className="text-white text-xs font-medium">{payload[0].name}</p>
                <p className="text-primary text-sm font-bold">{payload[0].value} tasks</p>
            </div>
        )
    }
    return null
}

export function StatusDoughnut({ data = [] }: StatusDoughnutProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0)

    if (total === 0) {
        return (
            <Card className="bg-[#1c1c1c] border-white/5 h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground p-6">
                <div className="p-3 rounded-full bg-white/5 mb-3">
                    <Zap className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-sm font-medium">No task data available</p>
                <p className="text-xs opacity-50">Create tasks to see distribution</p>
            </Card>
        )
    }

    return (
        <Card className="bg-[#1c1c1c] border-white/5 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Task Status
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span className="text-xs text-gray-300 ml-1 font-medium">{value} ({entry.payload.value})</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
                    <p className="text-3xl font-bold text-white">{total}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tasks</p>
                </div>
            </CardContent>
        </Card>
    )
}
