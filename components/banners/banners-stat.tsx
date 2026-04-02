import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export default function BannersStat({totalBanners, publishedCount, unpublishedCount}: {totalBanners: number, publishedCount: number, unpublishedCount: number}) {
    const { t } = useTranslation();
  return (
      <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.totalBanners')}</CardTitle>
                        <LayoutList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBanners}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.published')}</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.unpublished')}</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">{unpublishedCount}</div>
                    </CardContent>
                </Card>
            </div>
  )
}