'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import NotificationsController from '@/controllers/notifications-controller'
import type { Notification } from '@/controllers/notifications-controller'

import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'

import {
    Bell, BellRing, Search, X, Trash2, Plus,
    Send, AlertTriangle, Eye, Clock, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

/* ============================================================
   Constants
   ============================================================ */
const PAGE_LIMIT = 10

/* ============================================================
   Page
   ============================================================ */
export default function NotificationsPage() {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()
    const isRtl = i18n.language === 'ar'

    /* ── state ── */
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [viewNotif, setViewNotif] = useState<Notification | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null)
    const [createOpen, setCreateOpen] = useState(false)

    /* ── fetch all notifications ── */
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => NotificationsController.getNotifications('all'),
    })

    /* ── client-side search filter ── */
    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return notifications
        const q = searchQuery.toLowerCase()
        return notifications.filter(
            (n) =>
                n.title.toLowerCase().includes(q) ||
                n.message.toLowerCase().includes(q)
        )
    }, [notifications, searchQuery])

    /* ── pagination ── */
    const totalPages = Math.ceil(filtered.length / PAGE_LIMIT)
    const paginated = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT)

    /* ── delete mutation ── */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => NotificationsController.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            setDeleteTarget(null)
            toast.success(t('notifications.deleteSuccess'))
        },
        onError: () => toast.error(t('notifications.errors.deleteFailed')),
    })

    /* ── create mutation ── */
    const createMutation = useMutation({
        mutationFn: (payload: { title: string; message: string }) =>
            NotificationsController.createForAll(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            setCreateOpen(false)
            toast.success(t('notifications.createSuccess'))
        },
        onError: () => toast.error(t('notifications.errors.createFailed')),
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

    /* ─────────────────────────────────── RENDER ─────────────────────────────── */
    return (
        <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <BellRing className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('notifications.title')}
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {t('notifications.subtitle')}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="gap-2 shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    {t('notifications.sendNew')}
                </Button>
            </div>

            {/* ── STATS ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label={t('notifications.totalNotifications')}
                    value={notifications.length}
                    icon={<Bell className="h-5 w-5" />}
                    color="text-blue-500"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatCard
                    label={t('notifications.todayCount')}
                    value={notifications.filter(n =>
                        new Date(n.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                    icon={<Clock className="h-5 w-5" />}
                    color="text-violet-500"
                    bg="bg-violet-50 dark:bg-violet-900/20"
                />
                <StatCard
                    label={t('notifications.broadcastCount')}
                    value={notifications.length}
                    icon={<Send className="h-5 w-5" />}
                    color="text-emerald-500"
                    bg="bg-emerald-50 dark:bg-emerald-900/20"
                />
            </div>

            {/* ── SEARCH ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('notifications.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
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
                <span className="text-sm text-muted-foreground shrink-0">
                    {filtered.length} {t('notifications.results')}
                </span>
            </div>

            {/* ── TABLE ── */}
            <Card className="shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold w-14 text-center">#</TableHead>
                            <TableHead className="font-semibold">{t('notifications.title_field')}</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">{t('notifications.message')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('notifications.date')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t('common.loading')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginated.length > 0 ? (
                            paginated.map((notif) => (
                                <TableRow key={notif.id} className="hover:bg-muted/50 transition-colors">
                                    {/* ID */}
                                    <TableCell className="text-center font-medium text-muted-foreground text-sm">
                                        {notif.id}
                                    </TableCell>

                                    {/* Title */}
                                    <TableCell>
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Bell className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="font-medium text-sm leading-tight line-clamp-1">
                                                {notif.title}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Message (hidden on small) */}
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                                            {notif.message}
                                        </span>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-center text-xs text-muted-foreground">
                                        <div>{formatDate(notif.createdAt)}</div>
                                        <div className="opacity-70">{formatTime(notif.createdAt)}</div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setViewNotif(notif)}
                                                title={t('common.view')}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                onClick={() => setDeleteTarget(notif)}
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
                                <TableCell colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                            <Bell className="h-8 w-8 opacity-40" />
                                        </div>
                                        <p className="font-medium text-base">
                                            {searchQuery
                                                ? t('notifications.noResults')
                                                : t('notifications.noNotifications')}
                                        </p>
                                        <p className="text-sm opacity-70">
                                            {searchQuery
                                                ? t('notifications.tryDifferentSearch')
                                                : t('notifications.getStarted')}
                                        </p>
                                        {searchQuery && (
                                            <Button
                                                variant="outline" size="sm"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                {t('notifications.clearSearch')}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t('common.showing')} {((page - 1) * PAGE_LIMIT) + 1}–
                        {Math.min(page * PAGE_LIMIT, filtered.length)}{' '}
                        {t('common.of')} {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline" size="icon" className="h-8 w-8"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{page} / {totalPages}</span>
                        <Button
                            variant="outline" size="icon" className="h-8 w-8"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* ── DETAIL DIALOG ── */}
            {viewNotif && (
                <NotificationDetailDialog
                    notification={viewNotif}
                    onClose={() => setViewNotif(null)}
                    formatDate={formatDate}
                    formatTime={formatTime}
                />
            )}

            {/* ── DELETE DIALOG ── */}
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
                            {t('notifications.deleteMessage', { title: deleteTarget?.title })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleteMutation.isPending}
                        >
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

            {/* ── CREATE DIALOG ── */}
            <CreateNotificationDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={(payload) => createMutation.mutate(payload)}
                isSending={createMutation.isPending}
            />
        </div>
    )
}

/* ============================================================
   Stat Card
   ============================================================ */
function StatCard({
    label, value, icon, color, bg,
}: {
    label: string; value: number; icon: React.ReactNode; color: string; bg: string
}) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${color}`}>
                    {icon}
                </span>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

/* ============================================================
   Notification Detail Dialog
   ============================================================ */
function NotificationDetailDialog({
    notification,
    onClose,
    formatDate,
    formatTime,
}: {
    notification: Notification
    onClose: () => void
    formatDate: (d: string) => string
    formatTime: (d: string) => string
}) {
    const { t } = useTranslation()
    return (
        <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Bell className="h-4 w-4 text-primary" />
                        </div>
                        {t('notifications.details')}
                    </DialogTitle>
                    <DialogDescription>{t('notifications.detailsDesc')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Title */}
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('notifications.title_field')}
                        </Label>
                        <p className="text-sm font-semibold bg-muted/50 rounded-lg px-3 py-2">
                            {notification.title}
                        </p>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('notifications.message')}
                        </Label>
                        <p className="text-sm bg-muted/50 rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap">
                            {notification.message}
                        </p>
                    </div>

                    {/* Data (if any) */}
                    {notification.data && (
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {t('notifications.data')}
                            </Label>
                            <pre className="text-xs bg-muted/50 rounded-lg px-3 py-2 overflow-auto max-h-28">
                                {JSON.stringify(notification.data, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Date row */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatDate(notification.createdAt)} — {formatTime(notification.createdAt)}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

/* ============================================================
   Create Notification Dialog
   ============================================================ */
function CreateNotificationDialog({
    open,
    onClose,
    onCreate,
    isSending,
}: {
    open: boolean
    onClose: () => void
    onCreate: (payload: { title: string; message: string }) => void
    isSending: boolean
}) {
    const { t } = useTranslation()
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    const isValid = title.trim().length > 0 && message.trim().length > 0

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid) return
        onCreate({ title: title.trim(), message: message.trim() })
    }

    const handleClose = () => {
        setTitle('')
        setMessage('')
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Send className="h-4 w-4 text-primary" />
                        </div>
                        {t('notifications.sendNew')}
                    </DialogTitle>
                    <DialogDescription>{t('notifications.sendNewDesc')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="notif-title">{t('notifications.title_field')}</Label>
                        <Input
                            id="notif-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('notifications.titlePlaceholder')}
                            disabled={isSending}
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                        <Label htmlFor="notif-message">{t('notifications.message')}</Label>
                        <Textarea
                            id="notif-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('notifications.messagePlaceholder')}
                            rows={4}
                            disabled={isSending}
                            className="resize-none"
                        />
                    </div>

                    {/* Audience hint */}
                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2.5 text-xs text-blue-700 dark:text-blue-300">
                        <BellRing className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>{t('notifications.broadcastHint')}</span>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isSending}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={!isValid || isSending} className="gap-2">
                            <Send className="h-4 w-4" />
                            {isSending ? t('common.loading') : t('notifications.send')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
