import React from 'react'
import {Icon} from 'lucide-react'
export default function DashboardState({ title, value, change, color, icon }: { title: string; value: number; change: string; color: string; icon: React.ReactNode }) {
    return (
        <div

            className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
                    <p className="text-sm text-green-500 mt-1">{change} from last month</p>
                </div>
                <div className={`rounded-full bg-muted p-3 ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
