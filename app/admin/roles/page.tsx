'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'

import RolesController from '@/controllers/roles-controller'
import type { Role, RoleStatItem } from '@/controllers/roles-controller'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import {
    Search,
    X,
    Plus,
    Pencil,
    Trash2,
    ShieldCheck,
    Users,
    BarChart3,
    ShieldAlert,
    AlertTriangle,
} from 'lucide-react'

/* ============================================================
   Types
   ============================================================ */
interface RoleFormValues {
    role: string
    title_en: string
    title_ar: string
}

/* ============================================================
   Role Badge Colors
   ============================================================ */
const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    store_owner: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    driver: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    manager: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const getRoleColor = (role: string): string =>
    ROLE_COLORS[role.toLowerCase()] ??
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'

const prettify = (slug: string): string =>
    slug.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

/* ============================================================
   Page
   ============================================================ */
export default function RolesPage() {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()
    const isRtl = i18n.language === 'ar'

    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Role | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    /* ── data ── */
    const { data: roles = [], isLoading: rolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: RolesController.getRoles,
    })

    const { data: stats } = useQuery({
        queryKey: ['roles', 'statistics'],
        queryFn: RolesController.getStatistics,
    })

    /* ── filtered list ── */
    const filteredRoles = useMemo(() => {
        if (!searchQuery.trim()) return roles as Role[]
        const q = searchQuery.toLowerCase()
        return (roles as Role[]).filter((r) =>
            r.role.toLowerCase().includes(q) ||
            (r.title_en ?? '').toLowerCase().includes(q) ||
            (r.title_ar ?? '').toLowerCase().includes(q)
        )
    }, [roles, searchQuery])

    /* ── date formatter ── */
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        })

    /* ── mutations ── */
    const createMutation = useMutation({
        mutationFn: (values: RoleFormValues) =>
            RolesController.createRole({
                role: values.role,
                title_en: values.title_en || undefined,
                title_ar: values.title_ar || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
            setCreateOpen(false)
            toast.success(t('roles.createSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('roles.errors.saveFailed'))
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: number; values: RoleFormValues }) =>
            RolesController.updateRole(id, {
                role: values.role,
                title_en: values.title_en || undefined,
                title_ar: values.title_ar || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
            setEditTarget(null)
            toast.success(t('roles.updateSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('roles.errors.saveFailed'))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => RolesController.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
            setDeleteTarget(null)
            toast.success(t('roles.deleteSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('roles.errors.deleteFailed'))
        },
    })

    /* ── computed stats ── */
    const topRole = useMemo(() => {
        if (!stats?.roles?.length) return null
        return [...stats.roles].sort((a: RoleStatItem, b: RoleStatItem) => b.userCount - a.userCount)[0]
    }, [stats])

    const totalAssigned = useMemo(
        () => stats?.roles?.reduce((sum: number, r: RoleStatItem) => sum + r.userCount, 0) ?? 0,
        [stats],
    )

    /* ─────────────────────────────────────────────────────────
       Render
    ───────────────────────────────────────────────────────── */
    return (
        <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('roles.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('roles.subtitle')}</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="gap-2 self-start sm:self-auto">
                    <Plus className="h-4 w-4" />
                    {t('roles.addRole')}
                </Button>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('roles.totalRoles')}</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalRoles ?? roles.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('roles.rolesConfigured')}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('roles.mostAssigned')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{topRole?.userCount ?? '—'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {topRole ? prettify(topRole.name) : '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('roles.totalAssigned')}</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalAssigned}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('roles.usersWithRoles')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('roles.searchPlaceholder')}
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

            {/* ── TABLE ── */}
            <Card className="shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-center w-16">{t('common.id')}</TableHead>
                            <TableHead className="font-semibold">{t('roles.roleName')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('roles.titleEn')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('roles.titleAr')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('roles.usersCount')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('roles.createdAt')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rolesLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t('common.loading')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => {
                                const stat = stats?.roles?.find((s: RoleStatItem) => s.id === role.id)
                                return (
                                    <TableRow key={role.id} className="hover:bg-muted/50 transition-colors">
                                        {/* ID */}
                                        <TableCell className="text-center font-medium text-muted-foreground">
                                            {role.id}
                                        </TableCell>

                                        {/* Slug badge */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleColor(role.role)}`}>
                                                    {prettify(role.role)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* title_en */}
                                        <TableCell className="text-center text-sm">
                                            {role.title_en
                                                ? <span className="font-medium">{role.title_en}</span>
                                                : <span className="text-muted-foreground italic text-xs">{t('common.noData')}</span>
                                            }
                                        </TableCell>

                                        {/* title_ar */}
                                        <TableCell className="text-center text-sm" dir="rtl">
                                            {role.title_ar
                                                ? <span className="font-medium">{role.title_ar}</span>
                                                : <span className="text-muted-foreground italic text-xs">{t('common.noData')}</span>
                                            }
                                        </TableCell>

                                        {/* User count */}
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="gap-1 shadow-sm">
                                                <Users className="h-3 w-3" />
                                                {stat?.userCount ?? '—'}
                                            </Badge>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-center text-sm text-muted-foreground">
                                            {formatDate(role.createdAt)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                    onClick={() => setEditTarget(role)}
                                                    title={t('common.edit')}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    onClick={() => setDeleteTarget(role)}
                                                    title={t('common.delete')}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <ShieldCheck className="h-12 w-12 opacity-25" />
                                        <p className="font-medium text-base">
                                            {searchQuery ? t('roles.noResults') : t('roles.noRoles')}
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery ? t('roles.tryDifferentSearch') : t('roles.getStarted')}
                                        </p>
                                        {searchQuery && (
                                            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                                                {t('roles.clearSearch')}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* ── CREATE DIALOG ── */}
            <RoleFormDialog
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSubmit={(values) => createMutation.mutate(values)}
                isLoading={createMutation.isPending}
            />

            {/* ── EDIT DIALOG ── */}
            <RoleFormDialog
                open={!!editTarget}
                mode="edit"
                initialValues={{
                    role: editTarget?.role ?? '',
                    title_en: editTarget?.title_en ?? '',
                    title_ar: editTarget?.title_ar ?? '',
                }}
                onClose={() => setEditTarget(null)}
                onSubmit={(values) =>
                    editTarget && updateMutation.mutate({ id: editTarget.id, values })
                }
                isLoading={updateMutation.isPending}
            />

            {/* ── DELETE CONFIRM ── */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle>{t('common.confirm_delete')}</DialogTitle>
                        </div>
                        <DialogDescription className="mt-2">
                            {t('roles.deleteMessage', { role: deleteTarget ? prettify(deleteTarget.role) : '' })}
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
        </div>
    )
}

/* ============================================================
   Role Form Dialog
   ============================================================ */
interface RoleFormDialogProps {
    open: boolean
    mode: 'create' | 'edit'
    initialValues?: RoleFormValues
    onClose: () => void
    onSubmit: (values: RoleFormValues) => void
    isLoading: boolean
}

const EMPTY_VALUES: RoleFormValues = { role: '', title_en: '', title_ar: '' }

function RoleFormDialog({ open, mode, initialValues, onClose, onSubmit, isLoading }: RoleFormDialogProps) {
    const { t } = useTranslation()

    const validationSchema = Yup.object({
        role: Yup.string()
            .required(t('roles.validation.roleRequired'))
            .min(2, t('roles.validation.roleMin'))
            .matches(/^[a-zA-Z_]+$/, t('roles.validation.rolePattern')),
        title_en: Yup.string().optional(),
        title_ar: Yup.string().optional(),
    })

    const formik = useFormik<RoleFormValues>({
        initialValues: initialValues ?? EMPTY_VALUES,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            onSubmit({ ...values, role: values.role.trim().toLowerCase() })
        },
    })

    useEffect(() => {
        if (!open) formik.resetForm()
    }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

    const isCreate = mode === 'create'

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isCreate ? t('roles.addRole') : t('roles.editRole')}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreate ? t('roles.addRoleDesc') : t('roles.editRoleDesc')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 pt-2">
                    {/* Role slug */}
                    <div className="space-y-2">
                        <Label htmlFor="role-input">
                            {t('roles.roleName')}
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="role-input"
                            placeholder={t('roles.roleNamePlaceholder')}
                            {...formik.getFieldProps('role')}
                            className={formik.touched.role && formik.errors.role ? 'border-destructive' : ''}
                            autoFocus
                        />
                        {formik.touched.role && formik.errors.role && (
                            <p className="text-xs text-destructive">{formik.errors.role}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{t('roles.roleNameHint')}</p>
                    </div>

                    {/* Titles row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* title_en */}
                        <div className="space-y-2">
                            <Label htmlFor="title-en-input">{t('roles.titleEn')}</Label>
                            <Input
                                id="title-en-input"
                                placeholder={t('roles.titleEnPlaceholder')}
                                {...formik.getFieldProps('title_en')}
                                dir="ltr"
                            />
                        </div>

                        {/* title_ar */}
                        <div className="space-y-2">
                            <Label htmlFor="title-ar-input">{t('roles.titleAr')}</Label>
                            <Input
                                id="title-ar-input"
                                placeholder={t('roles.titleArPlaceholder')}
                                {...formik.getFieldProps('title_ar')}
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? t('common.saving')
                                : isCreate
                                    ? t('common.create')
                                    : t('common.update')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
