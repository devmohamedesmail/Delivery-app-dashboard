import React from 'react'
import { Store, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

export default function StoresHeader({
    setIsCreateOpen,
    createFormik,
    setLogoPreview,
    setBannerPreview
}: {
    setIsCreateOpen: (open: boolean) => void;
    createFormik: any;
    setLogoPreview: (preview: string | null) => void;
    setBannerPreview: (preview: string | null) => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    {t('stores.title')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{t('stores.subtitle')}</p>
            </div>
            <Button onClick={() => { setIsCreateOpen(true); createFormik.resetForm(); setLogoPreview(null); setBannerPreview(null) }} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('stores.add')}
            </Button>
        </div>
    )
}
