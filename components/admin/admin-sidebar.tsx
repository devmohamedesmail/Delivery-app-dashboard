'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    ShoppingCart,
    BarChart3,
    FileText,
    Store,
    MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface AdminSidebarProps {
    isCollapsed: boolean
    isMobileOpen: boolean
    onClose?: () => void
}



export function AdminSidebar({ isCollapsed, isMobileOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()
    const {t} =useTranslation();


    const navigationItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    
    {
        title: t('sidebar.settings'),
        href: '/admin/settings',
        icon: Settings
    }
]

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out',
                    'flex flex-col',
                    isCollapsed && !isMobileOpen ? 'w-20' : 'w-72',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo Section */}
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70">
                            <Store className="h-6 w-6 text-primary-foreground" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-foreground">Delivery</span>
                                <span className="text-xs text-muted-foreground">Admin Panel</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {navigationItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                            const Icon = item.icon

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                            'hover:bg-accent hover:text-accent-foreground',
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                                : 'text-muted-foreground',
                                            isCollapsed && 'justify-center'
                                        )}
                                    >
                                        <Icon className={cn('h-5 w-5 shrink-0', isActive && 'animate-pulse')} />
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="border-t border-border p-4">
                    <div className={cn(
                        'flex items-center gap-3 rounded-lg bg-muted/50 p-3',
                        isCollapsed && 'justify-center'
                    )}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                                <p className="text-xs text-muted-foreground truncate">admin@delivery.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
