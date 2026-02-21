import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSetting } from '@/hooks/useSetting'

export default function Logo() {
    const { t, i18n } = useTranslation();
    const { settings } = useSetting();
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
                {settings?.logo && (
                    <img src={settings?.logo} alt={i18n.language === "en" ? settings?.name_en : settings?.name_ar} width={100} height={100} />
                )}
            </div>
            <span className="text-xl font-bold text-foreground">{i18n.language === "en" ? settings?.name_en : settings?.name_ar}</span>
        </div>
    )
}
