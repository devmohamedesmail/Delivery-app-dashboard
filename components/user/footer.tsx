"use client"
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Package } from 'lucide-react'
import { useSetting } from '@/hooks/useSetting'

export default function Footer() {
    const { t, i18n } = useTranslation()
    const { settings } = useSetting()
    return (
        <footer className="border-t border-border bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70">
                            {settings?.logo && (
                                <img src={settings?.logo} alt="Logo" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <span className="text-lg font-bold text-foreground">{i18n.language === 'ar' ? settings?.name_ar : settings?.name_en}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('home.footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    )
}
