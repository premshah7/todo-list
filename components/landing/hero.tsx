'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Play } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                    v2.0 is now live
                </div>

                {/* Headline */}
                <h1 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Manage projects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">radical clarity</span>.
                </h1>

                {/* Subheading */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    The minimal project manager for teams who value focus over clutter.
                    Streamline your workflow with AI-driven insights and a beautiful, distraction-free interface.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Link href="/register">
                        <button className="h-12 px-8 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                            Start for free
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                    <button className="h-12 px-8 rounded-full bg-card text-foreground border border-border font-medium hover:bg-muted transition-all flex items-center gap-2 shadow-sm">
                        <Play className="w-4 h-4 fill-foreground" />
                        Watch Demo
                    </button>
                </div>

                {/* Social Proof / Trust */}
                <div className="flex items-center justify-center gap-8 text-muted-foreground text-sm font-medium animate-in fade-in zoom-in-50 duration-1000 delay-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        14-day free trial
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 dark:bg-primary/10 rounded-[100%] blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute top-20 right-0 w-[800px] h-[600px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-[100%] blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
        </section>
    )
}
