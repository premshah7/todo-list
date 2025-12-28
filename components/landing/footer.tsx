'use client'

import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/50 py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-[10px]">AI</span>
                            </div>
                            <span className="text-base font-bold text-foreground">SyncOps</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Building the future of work with clarity and focus. Designed for teams who move fast.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2025 SyncOps Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {/* Social Placeholders */}
                        <div className="w-5 h-5 bg-muted rounded-full" />
                        <div className="w-5 h-5 bg-muted rounded-full" />
                        <div className="w-5 h-5 bg-muted rounded-full" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
