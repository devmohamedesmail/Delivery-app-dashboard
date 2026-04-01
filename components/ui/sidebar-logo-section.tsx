import React from 'react'
import { useSetting } from '@/hooks/useSetting'

export default function SidebarLogoSection({ isCollapsed }: { isCollapsed: boolean }) {
    const { settings } = useSetting();
    return (
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
                    {settings?.logo && (
                        <img src={settings?.logo} alt="Logo" width={40} height={40} />
                    )}
                </div>
                {/* <Logo /> */}

                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">{settings?.name_en}</span>
                        <span className="text-xs text-muted-foreground">{settings?.name_ar}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
