import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '../ui/card'
import { Store, ToggleRight, ShieldCheck, Star } from 'lucide-react'

export default function StoresStat({total,activeCount,verifiedCount,featuredCount}:{
    total:number;
    activeCount:number;
    verifiedCount:number;
    featuredCount:number;
}) {
    const {t}=useTranslation();
  return (
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: t('stores.totalStores'), value: total, color: 'text-primary', icon: <Store className="h-5 w-5" /> },
                    { label: t('stores.activeStores'), value: activeCount, color: 'text-emerald-500', icon: <ToggleRight className="h-5 w-5" /> },
                    { label: t('stores.verifiedStores'), value: verifiedCount, color: 'text-blue-500', icon: <ShieldCheck className="h-5 w-5" /> },
                    { label: t('stores.featuredStores'), value: featuredCount, color: 'text-amber-500', icon: <Star className="h-5 w-5" /> },
                ].map((stat) => (
                    <Card key={stat.label} className="border border-border">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                            <div>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
  )
}
