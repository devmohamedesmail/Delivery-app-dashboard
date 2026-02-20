'use client'

import React, { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Image from 'next/image'

import CategoriesController from '@/controllers/categories-controller'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/controllers/categories-controller'
import StoreTypeController from '@/controllers/store-types-controller'

import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'

import {
    Search, X, Trash2, Pencil, Plus,
    FolderOpen, AlertTriangle, ChevronLeft, ChevronRight,
    ImageIcon, Tag,
} from 'lucide-react'

/* ============================================================
   Constants
   ============================================================ */
const PAGE_SIZE = 10

/* ============================================================
   Page
   ============================================================ */
export default function CategoriesPage() {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()
    const isRtl = i18n.language === 'ar'

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Category | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

    /* ── fetch all categories ── */
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoriesController.getAll(),
    })

    /* ── fetch store types for dropdown ── */
    const { data: storeTypes = [] } = useQuery({
        queryKey: ['store-types'],
        queryFn: () => StoreTypeController.getStoreTypes(),
    })

    /* ── client-side search + pagination ── */
    const filtered = useMemo(() => {
        if (!search.trim()) return categories
        const q = search.toLowerCase()
        return categories.filter((c) =>
            c.name.toLowerCase().includes(q) ||
            (c.description ?? '').toLowerCase().includes(q)
        )
    }, [categories, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    /* ── mutations ── */
    const createMutation = useMutation({
        mutationFn: (data: CreateCategoryData) => CategoriesController.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setCreateOpen(false)
            toast.success(t('categories.createSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('categories.errors.saveFailed'))
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
            CategoriesController.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setEditTarget(null)
            toast.success(t('categories.updateSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('categories.errors.saveFailed'))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => CategoriesController.destroy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setDeleteTarget(null)
            toast.success(t('categories.deleteSuccess'))
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? t('categories.errors.deleteFailed'))
        },
    })

    /* ── helpers ── */
    const getStoreTypeName = (id: number) => {
        const st = storeTypes.find((s) => s.id === id)
        return st ? st.name_en : `#${id}`
    }

    /* ─────────────────────────────────── RENDER ─────────────────────────────── */
    return (
        <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* HEADER */}
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

            {/* STAT CARD */}
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

            {/* SEARCH */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('categories.searchPlaceholder')}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className="pl-10 pr-10 shadow-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* TABLE */}
            <Card className="shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold w-14 text-center">#</TableHead>
                            <TableHead className="font-semibold w-16">{t('categories.image')}</TableHead>
                            <TableHead className="font-semibold">{t('categories.name')}</TableHead>
                            <TableHead className="font-semibold">{t('categories.description')}</TableHead>
                            <TableHead className="font-semibold">{t('categories.storeType')}</TableHead>
                            <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t('common.loading')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginated.length > 0 ? (
                            paginated.map((cat) => (
                                <TableRow key={cat.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="text-center font-medium text-muted-foreground">
                                        {cat.id}
                                    </TableCell>
                                    <TableCell>
                                        {cat.image ? (
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden border">
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                        {cat.description ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {getStoreTypeName(cat.store_type_id)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setEditTarget(cat)}
                                                title={t('common.edit')}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                onClick={() => setDeleteTarget(cat)}
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
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <FolderOpen className="h-12 w-12 opacity-25" />
                                        <p className="font-medium text-base">
                                            {search ? t('categories.noResults') : t('categories.noCategories')}
                                        </p>
                                        {search && (
                                            <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                                                {t('categories.clearSearch')}
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
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t('common.showing')} {((page - 1) * PAGE_SIZE) + 1}–
                        {Math.min(page * PAGE_SIZE, filtered.length)}{' '}
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

            {/* CREATE DIALOG */}
            <CategoryFormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSubmit={(data) => createMutation.mutate(data as CreateCategoryData)}
                isPending={createMutation.isPending}
                storeTypes={storeTypes}
                title={t('categories.add')}
            />

            {/* EDIT DIALOG */}
            {editTarget && (
                <CategoryFormDialog
                    open={!!editTarget}
                    onOpenChange={(o) => { if (!o) setEditTarget(null) }}
                    onSubmit={(data) => updateMutation.mutate({ id: editTarget.id, data })}
                    isPending={updateMutation.isPending}
                    storeTypes={storeTypes}
                    title={t('categories.edit')}
                    defaultValues={editTarget}
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
                            {t('categories.deleteMessage', { name: deleteTarget?.name })}
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
   Category Form Dialog
   ============================================================ */
interface StoreTypeOption { id: number; name_en: string; name_ar: string }

interface CategoryFormProps {
    open: boolean
    onOpenChange: (o: boolean) => void
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void
    isPending: boolean
    storeTypes: StoreTypeOption[]
    title: string
    defaultValues?: Category
}

function CategoryFormDialog({
    open, onOpenChange, onSubmit, isPending, storeTypes, title, defaultValues,
}: CategoryFormProps) {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState(defaultValues?.name ?? '')
    const [description, setDescription] = useState(defaultValues?.description ?? '')
    const [storeTypeId, setStoreTypeId] = useState<string>(
        defaultValues?.store_type_id ? String(defaultValues.store_type_id) : ''
    )
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image ?? null)

    // Reset when dialog opens/closes or defaultValues changes
    React.useEffect(() => {
        setName(defaultValues?.name ?? '')
        setDescription(defaultValues?.description ?? '')
        setStoreTypeId(defaultValues?.store_type_id ? String(defaultValues.store_type_id) : '')
        setImageFile(null)
        setImagePreview(defaultValues?.image ?? null)
    }, [defaultValues, open])

    const handleFile = (file: File) => {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) { toast.error(t('categories.validation.nameRequired')); return }
        if (!storeTypeId) { toast.error(t('categories.validation.storeTypeRequired')); return }

        const data: CreateCategoryData | UpdateCategoryData = {
            name: name.trim(),
            description: description.trim() || undefined,
            store_type_id: Number(storeTypeId),
            ...(imageFile ? { image: imageFile } : {}),
        }
        onSubmit(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{t('categories.formDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.name')} *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('categories.namePlaceholder')}
                        />
                    </div>

                    {/* Store Type */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.storeType')} *</Label>
                        <Select value={storeTypeId} onValueChange={setStoreTypeId}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('categories.selectStoreType')} />
                            </SelectTrigger>
                            <SelectContent>
                                {storeTypes.map((st) => (
                                    <SelectItem key={st.id} value={String(st.id)}>
                                        {st.name_en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.description')}</Label>
                        <textarea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder={t('categories.descriptionPlaceholder')}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.image')}</Label>
                        <div
                            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/60 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <div className="relative h-28 w-28 rounded-lg overflow-hidden">
                                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 opacity-40" />
                                    <span className="text-sm">{t('categories.clickToUpload')}</span>
                                </div>
                            )}
                            {imagePreview && (
                                <span className="text-xs text-primary">{t('categories.changeImage')}</span>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? t('common.saving') : (defaultValues ? t('common.update') : t('common.create'))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
