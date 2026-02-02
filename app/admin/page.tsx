import React from 'react'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'text-blue-500'
    },
    {
      title: 'Products',
      value: '567',
      change: '+8.2%',
      icon: Package,
      color: 'text-green-500'
    },
    {
      title: 'Customers',
      value: '8,901',
      change: '+23.1%',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-sm text-green-500 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
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
