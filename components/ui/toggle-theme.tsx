import React from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ToggleTheme() {
    const [isDark, setIsDark] = React.useState(false)
    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }
    return (
        <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
            )}
        </button>
    )
}
