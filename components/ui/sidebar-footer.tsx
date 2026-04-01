import React from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export default function SidebarFooter({ isCollapsed }: { isCollapsed: boolean }) {
    const { user } = useAuth();
    return (
        <div className="border-t border-border p-4">
            <div className={cn(
                'flex items-center gap-3 rounded-lg bg-muted/50 p-3',
                isCollapsed && 'justify-center'
            )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0)}
                </div>
                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                )}
            </div>
        </div>
    )
}