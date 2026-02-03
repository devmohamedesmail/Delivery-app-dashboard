import React from 'react'
import { Package, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useSetting } from '@/hooks/useSetting'
import ToggleLang from '../ui/toggle-lang'

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { settings } = useSetting();
    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70">
                            {settings?.logo && (
                                <img src={settings?.logo} alt="Logo" width={40} height={40} />
                            )}
                        </div>
                        <span className="text-xl font-bold text-foreground">{i18n.language === "en" ? settings?.name_en : settings?.name_ar}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ToggleLang />
                        <Link href="/auth/login" className="hidden sm:inline-flex">
                            {t('home.nav.login')}
                        </Link>
                        <Link href="/auth/register">
                            <Button className="shadow-lg shadow-primary/20">
                                {t('home.nav.getStarted')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
