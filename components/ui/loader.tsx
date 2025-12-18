import React from 'react'

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    }

    return (
        <div className={`inline-block ${sizeClasses[size]} ${className}`}>
            <div className="animate-spin rounded-full border-solid border-primary border-t-transparent"></div>
        </div>
    )
}

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
            <div className="text-center space-y-4">
                <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
                <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
            </div>
        </div>
    )
}
