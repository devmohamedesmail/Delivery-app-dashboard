'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import OrdersController from '@/controllers/orders-controller'
import type { Order, OrderStatus } from '@/controllers/orders-controller'

import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'

import {
    Search, X, Trash2, Eye, ShoppingBag,
    Clock, CheckCircle2, Truck, XCircle,
    ChefHat, AlertTriangle, ChevronLeft, ChevronRight,
    Package, User, Store, Phone, MapPin, DollarSign,
} from 'lucide-react'

/* ============================================================
   Constants
   ============================================================ */
const ALL_STATUSES: OrderStatus[] = [
    'pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled',
]

const STATUS_CONFIG: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="h-3 w-3" /> },
    accepted: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <CheckCircle2 className="h-3 w-3" /> },
    preparing: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <ChefHat className="h-3 w-3" /> },
    on_the_way: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Truck className="h-3 w-3" /> },
    delivered: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
    cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="h-3 w-3" /> },
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
            {cfg.icon}
            {status.replace('_', ' ')}
        </span>
    )
}

/* ============================================================
   Page
   ============================================================ */
const PAGE_LIMIT = 10

export default function OrdersPage() {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()
    const isRtl = i18n.language === 'ar'

    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewOrder, setViewOrder] = useState<Order | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Order | null>(null)

    /* ── fetch ── */
    const { data, isLoading } = useQuery({
        queryKey: ['orders', page, statusFilter],
        queryFn: () => OrdersController.getOrders({
            page,
            limit: PAGE_LIMIT,
            status: statusFilter || undefined,
        }),
        placeholderData: (prev) => prev,
    })

    const { data: stats } = useQuery({
        queryKey: ['orders', 'statistics'],
        queryFn: () => OrdersController.getStatistics(),
    })

    const orders = data?.orders ?? []
    const pagination = data?.pagination

    /* ── client-side search filter ── */
    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return orders
        const q = searchQuery.toLowerCase()
        return orders.filter((o) =>
            String(o.id).includes(q) ||
            o.customer_name.toLowerCase().includes(q) ||
            o.phone.toLowerCase().includes(q) ||
            (o.store?.name ?? '').toLowerCase().includes(q) ||
            (o.user?.name ?? '').toLowerCase().includes(q)
        )
    }, [orders, searchQuery])

    /* ── status counts ── */
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        orders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1 })
        return counts
    }, [orders])

    /* ── mutations ── */
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
            OrdersController.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            toast.success(t('orders.updateStatusSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('orders.errors.updateFailed'))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => OrdersController.deleteOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            setDeleteTarget(null)
            toast.success(t('orders.deleteSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('orders.errors.deleteFailed'))
        },
    })

    /* ── helpers ── */
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        })

    const formatTime = (d: string) =>
        new Date(d).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', {
            hour: '2-digit', minute: '2-digit',
        })

    const formatPrice = (p: number) => `$${Number(p).toFixed(2)}`

    /* ─────────────────────────────────── RENDER ─────────────────────────────── */
    return (
        <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('orders.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('orders.subtitle')}</p>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label={t('orders.totalOrders')}
                    value={stats?.total_orders ?? pagination?.total_orders ?? '—'}
                    icon={<ShoppingBag className="h-4 w-4" />}
                    color="text-blue-500"
                />
                <StatCard
                    label={t('orders.pending')}
                    value={statusCounts['pending'] ?? 0}
                    icon={<Clock className="h-4 w-4" />}
                    color="text-yellow-500"
                />
                <StatCard
                    label={t('orders.delivered')}
                    value={statusCounts['delivered'] ?? 0}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    color="text-green-500"
                />
                <StatCard
                    label={t('orders.cancelled')}
                    value={statusCounts['cancelled'] ?? 0}
                    icon={<XCircle className="h-4 w-4" />}
                    color="text-red-500"
                />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('orders.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Status filter */}
                <Select
                    value={statusFilter || 'all'}
                    onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v as OrderStatus); setPage(1) }}
                >
                    <SelectTrigger className="w-40 shadow-sm">
                        <SelectValue placeholder={t('orders.allStatuses')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('orders.allStatuses')}</SelectItem>
                        {ALL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                                {t(`orders.statuses.${s}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* TABLE */}
            <Card className="shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold w-16 text-center">#</TableHead>
                            <TableHead className="font-semibold">{t('orders.customer')}</TableHead>
                            <TableHead className="font-semibold">{t('orders.store')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('orders.status')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('orders.total')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('orders.date')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t('common.loading')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((order) => (
                                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="text-center font-medium text-muted-foreground">
                                        {order.id}
                                    </TableCell>

                                    {/* Customer */}
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-sm leading-tight">{order.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">{order.phone}</span>
                                        </div>
                                    </TableCell>

                                    {/* Store */}
                                    <TableCell>
                                        <span className="text-sm">{order.store?.name ?? `Store #${order.store_id}`}</span>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell className="text-center">
                                        <StatusBadge status={order.status} />
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell className="text-center">
                                        <span className="font-semibold text-sm">{formatPrice(order.total_price)}</span>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-center text-xs text-muted-foreground">
                                        <div>{formatDate(order.createdAt)}</div>
                                        <div>{formatTime(order.createdAt)}</div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setViewOrder(order)}
                                                title={t('common.view')}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                onClick={() => setDeleteTarget(order)}
                                                title={t('common.delete')}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <ShoppingBag className="h-12 w-12 opacity-25" />
                                        <p className="font-medium text-base">
                                            {searchQuery ? t('orders.noResults') : t('orders.noOrders')}
                                        </p>
                                        {searchQuery && (
                                            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                                                {t('orders.clearSearch')}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* PAGINATION */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t('common.showing')} {((page - 1) * PAGE_LIMIT) + 1}–
                        {Math.min(page * PAGE_LIMIT, pagination.total_orders)}{' '}
                        {t('common.of')} {pagination.total_orders}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            {page} / {pagination.total_pages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={page >= pagination.total_pages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* ORDER DETAIL DIALOG */}
            {viewOrder && (
                <OrderDetailDialog
                    order={viewOrder}
                    onClose={() => setViewOrder(null)}
                    onStatusChange={(status) =>
                        statusMutation.mutate({ id: viewOrder.id, status })
                    }
                    isUpdating={statusMutation.isPending}
                />
            )}

            {/* DELETE CONFIRM DIALOG */}
            <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle>{t('common.confirm_delete')}</DialogTitle>
                        </div>
                        <DialogDescription className="mt-2">
                            {t('orders.deleteMessage', { id: deleteTarget?.id })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? t('common.loading') : t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

/* ============================================================
   Stat card
   ============================================================ */
function StatCard({ label, value, icon, color }: {
    label: string; value: string | number; icon: React.ReactNode; color: string
}) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <span className={color}>{icon}</span>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

/* ============================================================
   Order Detail Dialog
   ============================================================ */
interface OrderDetailProps {
    order: Order
    onClose: () => void
    onStatusChange: (status: OrderStatus) => void
    isUpdating: boolean
}

function OrderDetailDialog({ order, onClose, onStatusChange, isUpdating }: OrderDetailProps) {
    const { t } = useTranslation()
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status)

    const items: { name: string; quantity: number; price: number }[] = Array.isArray(order.order)
        ? order.order
        : []

    const handleUpdate = () => {
        if (newStatus !== order.status) onStatusChange(newStatus)
    }

    return (
        <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {t('orders.orderDetails')} #{order.id}
                    </DialogTitle>
                    <DialogDescription>{t('orders.orderDetailsDesc')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Status update */}
                    <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg border bg-muted/30">
                        <span className="text-sm font-medium">{t('orders.status')}:</span>
                        <StatusBadge status={order.status} />
                        <div className="flex items-center gap-2 ml-auto">
                            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                                <SelectTrigger className="w-40 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_STATUSES.map((s) => (
                                        <SelectItem key={s} value={s} className="text-xs">
                                            {t(`orders.statuses.${s}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                size="sm"
                                onClick={handleUpdate}
                                disabled={isUpdating || newStatus === order.status}
                                className="h-8 text-xs"
                            >
                                {isUpdating ? t('common.saving') : t('common.update')}
                            </Button>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoSection icon={<User className="h-4 w-4" />} title={t('orders.customerInfo')}>
                            <InfoRow label={t('orders.name')} value={order.customer_name} />
                            <InfoRow label={t('orders.phone')} value={order.phone} />
                            {order.user && <InfoRow label={t('orders.userId')} value={`#${order.user.id} — ${order.user.name}`} />}
                        </InfoSection>

                        <InfoSection icon={<Store className="h-4 w-4" />} title={t('orders.storeInfo')}>
                            <InfoRow label={t('orders.storeName')} value={order.store?.name ?? `#${order.store_id}`} />
                            {order.store?.phone && <InfoRow label={<Phone className="h-3 w-3" />} value={order.store.phone} />}
                            {order.store?.address && <InfoRow label={<MapPin className="h-3 w-3" />} value={order.store.address} />}
                        </InfoSection>

                        <InfoSection icon={<MapPin className="h-4 w-4" />} title={t('orders.deliveryInfo')}>
                            <InfoRow label={t('orders.address')} value={order.delivery_address} />
                            {order.delivered_at && (
                                <InfoRow label={t('orders.deliveredAt')} value={new Date(order.delivered_at).toLocaleString()} />
                            )}
                        </InfoSection>

                        <InfoSection icon={<DollarSign className="h-4 w-4" />} title={t('orders.paymentInfo')}>
                            <InfoRow label={t('orders.total')} value={`$${Number(order.total_price).toFixed(2)}`} />
                            <InfoRow label={t('orders.date')} value={new Date(order.createdAt).toLocaleString()} />
                        </InfoSection>
                    </div>

                    {/* Items */}
                    {items.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                                {t('orders.items')} ({items.length})
                            </h4>
                            <div className="border rounded-lg overflow-hidden divide-y">
                                {items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors">
                                        <span className="font-medium">{item.name}</span>
                                        <div className="flex items-center gap-6 text-muted-foreground">
                                            <span>x{item.quantity}</span>
                                            <span className="font-semibold text-foreground w-16 text-right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 font-semibold text-sm">
                                    <span>{t('orders.total')}</span>
                                    <span>${Number(order.total_price).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

/* ── tiny helpers ── */
function InfoSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5 text-primary">
                {icon} {title}
            </h4>
            <div className="space-y-1.5 text-sm">{children}</div>
        </div>
    )
}

function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-muted-foreground min-w-0 shrink-0">{label}:</span>
            <span className="font-medium break-all">{value}</span>
        </div>
    )
}
