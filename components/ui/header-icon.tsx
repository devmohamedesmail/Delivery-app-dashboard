import React from 'react'

export default function HeaderIcon({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label={label}
        >
            
            {icon}
            {/* <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" /> */}
        </button>
    )
}
