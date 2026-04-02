'use client'
import React, { useState } from 'react'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import OrdersController from '@/controllers/orders-controller'
import DashboardState from '@/components/ui/dashboard-state'
import { useTranslation } from 'react-i18next'
import useAreas from '@/hooks/areas/useAreas'
import usePlaces from '@/hooks/places/usePlaces'

export default function AdminDashboard() {
  const { t } = useTranslation();

const {data:areas, isLoading:areasLoading,error:areasError, refetch:areasRefetch}=useAreas()
const {data:places, isLoading:placesLoading,error:placesError, refetch:placesRefetch}=usePlaces()
console.log("areas", areas)
console.log("places", places)
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => OrdersController.getOrders(),
    placeholderData: (prev) => prev,
  })
  console.log("orders", data?.orders?.length)
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('dashboard.welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardState
          title={t('dashboard.total_orders')}
          value={data?.orders?.length || 0}
          change={'+12.5%'}
          icon={<ShoppingCart />}
          color={'text-blue-500'}
        />
       
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New order #100{item}</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
              <span className="text-sm font-medium text-foreground">$123.45</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
