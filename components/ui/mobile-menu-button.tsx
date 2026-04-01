import React from 'react'
import { Menu } from 'lucide-react'
export default function MobileMenuButton({onClick}: {onClick: () => void}) {
    return (
         <button
                onClick={onClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent lg:hidden transition-colors"
                aria-label="Toggle menu"
            >
                <Menu className="h-5 w-5" />
            </button>
    )
}
