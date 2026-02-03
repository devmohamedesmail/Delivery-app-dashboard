'use client'

import React from 'react'
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import ToggleLang from '../ui/toggle-lang'
import ToggleTheme from '../ui/toggle-theme'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AdminHeaderProps {
    onMenuClick: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function AdminHeader({ onMenuClick, isCollapsed, onToggleCollapse }: AdminHeaderProps) {
    const [showUserMenu, setShowUserMenu] = React.useState(false)
    const {user , logout}=useAuth();
    const {t}=useTranslation();
    const router = useRouter();

    const handle_logout = async () => {
        await logout();
        setShowUserMenu(false);
        toast.success(t('auth.logout_success'));
        setTimeout(() => {
            router.push('/auth/login');
        }, 1000);
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

               <ToggleLang />
               <ToggleTheme />

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
                           {user?.name?.charAt(0)}
                        </div>
                        <span className="hidden md:block text-sm font-medium">{user?.name}</span>
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
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                    onClick={()=>router.push('/admin/profile')}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                                        <User className="h-4 w-4" />
                                        <span>{t('auth.profile')}</span>
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                                        <Settings className="h-4 w-4" />
                                        <span>{t('common.settings')}</span>
                                    </button>
                                </div>
                                <div className="border-t border-border p-2">
                                    <button onClick={()=>handle_logout()} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        <span>{t('auth.logout')}</span>
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
