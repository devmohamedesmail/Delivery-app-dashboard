import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CategoriesStat({categories}: {categories: any[]}) {
    const { t } = useTranslation()
  return (
    <div className="grid gap-4 sm:grid-cols-3">
                <Card className="shadow-sm">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('categories.totalCategories')}</p>
                            <p className="text-2xl font-bold">{categories.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
  )
}
