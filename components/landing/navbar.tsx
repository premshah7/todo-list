'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowRight } from 'lucide-react'

interface NavbarProps {
    user?: any
}

export function Navbar({ user }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <span className="text-lg font-bold text-foreground tracking-tight">Sync<span className="text-primary">Ops</span></span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                    <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <Link href="/dashboard">
                            <button className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors shadow-lg shadow-foreground/20">
                                Go to Dashboard
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                                Sign In
                            </Link>
                            <Link href="/register">
                                <button className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
