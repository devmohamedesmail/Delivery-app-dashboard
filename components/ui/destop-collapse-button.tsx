import React from 'react'
import { Menu } from 'lucide-react'
export default function DestopCollapseButton({onClick}: {onClick: () => void}) {
  return (
    <button
                onClick={onClick}
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>
  )
}
