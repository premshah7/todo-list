import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-orange-900/20 active:scale-95 transition-all duration-300 rounded-xl',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl',
            outline: 'border border-white/10 bg-white/5 hover:bg-white/10 text-foreground hover:text-white rounded-xl backdrop-blur-sm',
            ghost: 'hover:bg-white/5 hover:text-white rounded-xl',
            link: 'text-primary underline-offset-4 hover:underline',
        }

        const sizes = {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 px-3 text-sm',
            lg: 'h-11 px-8',
            icon: 'h-10 w-10',
        }

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
