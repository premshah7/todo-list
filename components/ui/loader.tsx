import React from 'react'

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4'
    }

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-primary border-t-transparent`}></div>
            {/* Glow effect */}
            <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full blur-md bg-primary/20 animate-pulse`}></div>
        </div>
    )
}

export function PageLoader() {
    return (
        <div className="flex h-full w-full items-center justify-center min-h-[50vh] p-8">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-white/10 blur-[1px]"></div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <p className="text-lg font-medium text-foreground animate-pulse">Loading...</p>
                    <p className="text-sm text-muted-foreground">Preparing your workspace</p>
                </div>
            </div>
        </div>
    )
}

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background/80 backdrop-blur-md transition-all duration-300">
            {/* Background Gradients */}
            <div className="absolute -top-[20%] -left-[10%] h-[50vh] w-[50vw] rounded-full bg-primary/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute -bottom-[20%] -right-[10%] h-[50vh] w-[50vw] rounded-full bg-secondary/20 blur-[100px] animate-pulse-slow delay-700"></div>

            <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
                <div className="relative flex items-center justify-center h-24 w-24">
                    {/* Outer Ring */}
                    <div className="absolute h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow"></div>
                    {/* Inner Ring */}
                    <div className="absolute h-16 w-16 rounded-full border-4 border-secondary/30 border-b-secondary animate-reverse-spin"></div>
                    {/* Core */}
                    <div className="h-4 w-4 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"></div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                        GearGuard
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] text-center">
                        Syncing your projects...
                    </p>
                </div>
            </div>
        </div>
    )
}
