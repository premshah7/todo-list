'use client'

import { BarChart3, Layout, Users, Zap } from 'lucide-react'

const features = [
    {
        name: 'Kanban Boards',
        description: 'Visualise your workflow with our intuitive, drag-and-drop Kanban boards. Customise columns to fit your process perfectly.',
        icon: Layout,
        color: 'bg-violet-100/50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
    },
    {
        name: 'Smart Analytics',
        description: 'Track progress without the noise. Get real-time insights into team velocity, task completion rates, and project health.',
        icon: BarChart3,
        color: 'bg-indigo-100/50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    },
    {
        name: 'Team Collaboration',
        description: 'Work together seamlessly. Mention team members, share files, and keep everyone aligned with real-time updates.',
        icon: Users,
        color: 'bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
        name: 'Instant Focus',
        description: 'Filter out distractions. Our "Focus Mode" clears the interface so you can concentrate on one task at a time.',
        icon: Zap,
        color: 'bg-amber-100/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">Everything you need, nothing you don't.</h2>
                    <p className="text-lg text-muted-foreground">
                        Powerful features packaged in a clean, minimal interface designed for high-performance teams.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.name}
                            className="group p-8 rounded-2xl bg-card border border-border hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-in fade-in zoom-in-50"
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">{feature.name}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
