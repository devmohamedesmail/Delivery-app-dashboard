'use client'

import React from 'react'
import { Menu, Bell, Search, Moon, Sun, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
    onMenuClick: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function AdminHeader({ onMenuClick, isCollapsed, onToggleCollapse }: AdminHeaderProps) {
    const [isDark, setIsDark] = React.useState(false)
    const [showUserMenu, setShowUserMenu] = React.useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent lg:hidden transition-colors"
                aria-label="Toggle menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
                onClick={onToggleCollapse}
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                    aria-label="Toggle theme"
                >
                    {isDark ? (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <Moon className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>

                {/* Notifications */}
                <button
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex h-10 items-center gap-2 rounded-lg px-3 hover:bg-accent transition-colors"
                        aria-label="User menu"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                            A
                        </div>
                        <span className="hidden md:block text-sm font-medium">Admin</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 border-b border-border">
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-muted-foreground">admin@delivery.com</p>
                                </div>
                                <div className="p-2">
                                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                                <div className="border-t border-border p-2">
                                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
