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
    MapPin,
    Image as ImageIcon,
    LandPlot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { useSetting } from '@/hooks/useSetting'
import { useAuth } from '@/hooks/useAuth'
import SidebarFooter from '../ui/sidebar-footer'
import SidebarLogoSection from '../ui/sidebar-logo-section'

interface AdminSidebarProps {
    isCollapsed: boolean
    isMobileOpen: boolean
    onClose?: () => void
}



export function AdminSidebar({ isCollapsed, isMobileOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()
    const { t , i18n} = useTranslation();
    const { settings } = useSetting();
    const { user } = useAuth();
    console.log(user)



    const navigationItems = [
        {
            title: t('sidebar.dashboard'),
            href: '/admin',
            icon: LayoutDashboard,
            role: ["admin"]
        },

        {
            title: t('sidebar.settings'),
            href: '/admin/settings',
            icon: Settings,
            role: ["admin"]
        },
        {
            title: t('sidebar.areas'),
            href: '/admin/areas',
            icon: LandPlot,
            role: ["admin", "delivery_man"]
        },
        {
            title: t('sidebar.places'),
            href: '/admin/places',
            icon: MapPin,
            role: ["admin", "delivery_man"]
        },
        {
            title: t('sidebar.store_types'),
            href: '/admin/store-types',
            icon: MapPin,
            role: ["admin"]
        },
        {
            title: t('sidebar.banners'),
            href: '/admin/banners',
            icon: ImageIcon,
            role: ["admin"]
        },
        {
            title: t('sidebar.stores'),
            href: '/admin/stores',
            icon: Store,
            role: ["admin"]
        },
        {
            title: t('sidebar.categories'),
            href: '/admin/categories',
            icon: Store,
            role: ["admin"]
        },
        {
            title: t('sidebar.orders'),
            href: '/admin/orders',
            icon: Store,
            role: ["admin", "delivery_man"]
        },
        {
            title: t('sidebar.users'),
            href: '/admin/users',
            icon: Users,
            role: ["admin"]
        },
        {
            title: t('sidebar.roles'),
            href: '/admin/roles',
            icon: Users,
            role: ["admin"]
        },
        {
            title: t('sidebar.notifications'),
            href: '/admin/notifications',
            icon: Users,
            role: ["admin"]
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
                    `fixed ${i18n.language === 'ar' ? 'right-0 ' : 'left-0' } top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out`,
                    'flex flex-col',
                    isCollapsed && !isMobileOpen ? 'w-20' : 'w-72',
                    isMobileOpen ? 'translate-x-0' : `${i18n.language === 'ar' ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`
                )}
            >
               
                <SidebarLogoSection isCollapsed={isCollapsed} />
                

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {navigationItems.filter(item => item.role.includes(user?.role?.role as string)).map((item) => {
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

                <SidebarFooter isCollapsed={isCollapsed} />
            </aside>
        </>
    )
}
