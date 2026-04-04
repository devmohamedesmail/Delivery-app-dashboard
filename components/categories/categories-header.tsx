import React from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'


export default function CategoriesHeader({setCreateOpen}: {setCreateOpen: (open: boolean) => void}) {
    const { t } = useTranslation()
  return (
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('categories.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('categories.subtitle')}</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="gap-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    {t('categories.add')}
                </Button>
            </div>
  )
}
