'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CategoriesController from '@/controllers/categories-controller'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/controllers/categories-controller'
import StoreTypeController from '@/controllers/store-types-controller'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CategoriesHeader from '@/components/categories/categories-header'
import CategoriesStat from '@/components/categories/categories-stat'
import CategoriesSearch from '@/components/categories/categories-search'
import CategoriesTable from '@/components/categories/categories-table'
import CategoryFormDialog from '@/components/categories/category-form-dialog'
import CategoryDeleteDialog from '@/components/categories/category-delete-dialog'


const PAGE_SIZE = 10

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
        return st ? `${st.name_en} - ${st.name_ar}` : `#${id}`
    }

    /* ─────────────────────────────────── RENDER ─────────────────────────────── */
    return (
        <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* HEADER */}
            <CategoriesHeader
                setCreateOpen={setCreateOpen}
            />


            {/* STAT CARD */}
            <CategoriesStat
                categories={categories}
            />

            {/* SEARCH */}
            <CategoriesSearch
                search={search}
                setSearch={setSearch}
                setPage={setPage}
            />

            {/* TABLE */}
            <CategoriesTable
                isLoading={isLoading}
                paginated={paginated}
                getStoreTypeName={getStoreTypeName}
                setEditTarget={setEditTarget}
                setDeleteTarget={setDeleteTarget}
                search={search}
                setSearch={setSearch}
                setPage={setPage}
            />

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
            <CategoryDeleteDialog
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                deleteMutation={deleteMutation}
                t={t}
            />
        </div>
    )
}


