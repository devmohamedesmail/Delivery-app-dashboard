'use client'
import { Bell } from 'lucide-react'
import ToggleLang from '../ui/toggle-lang'
import ToggleTheme from '../ui/toggle-theme'
import UserMenu from './user-menu'
import HeaderIcon from '../ui/header-icon'
import MobileMenuButton from '../ui/mobile-menu-button'
import DestopCollapseButton from '../ui/destop-collapse-button'


interface AdminHeaderProps {
    onMenuClick: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function AdminHeader({ onMenuClick, isCollapsed, onToggleCollapse }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 justify-between items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 lg:px-6">
            <MobileMenuButton onClick={onMenuClick} />
            <DestopCollapseButton onClick={onToggleCollapse} />
            <div className="flex items-center gap-2">
                <ToggleLang />
                <ToggleTheme />
                <HeaderIcon
                    icon={<Bell className="h-5 w-5 text-muted-foreground" />}
                    label="Notifications" onClick={() => { }}
                />
                <UserMenu />
            </div>
        </header>
    )
}
