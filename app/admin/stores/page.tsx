'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {
    Plus, Search, X, Pencil, Trash2, Store, Star, ToggleLeft, ToggleRight, ShieldCheck, ShieldOff
} from 'lucide-react'

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import StoreController, { Store as StoreType } from '@/controllers/stores-controller'
import StoreTypeController from '@/controllers/store-types-controller'

/* ─────────────────── helpers ─────────────────── */

function StoreImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
    if (!src) {
        return (
            <div className={`flex items-center justify-center bg-muted rounded-md ${className ?? 'w-10 h-10'}`}>
                <Store className="h-4 w-4 text-muted-foreground" />
            </div>
        )
    }
    return (
        <Image
            src={src}
            alt={alt}
            width={40}
            height={40}
            unoptimized
            className={`object-cover rounded-md ${className ?? 'w-10 h-10'}`}
        />
    )
}

/* ─────────────────── page ─────────────────── */

export default function StoresPage() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    // Dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<StoreType | null>(null)

    // Search
    const [searchQuery, setSearchQuery] = useState('')

    // Image previews
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)

    /* ───── data fetching ───── */

    const { data: stores = [], isLoading } = useQuery<StoreType[]>({
        queryKey: ['stores'],
        queryFn: StoreController.getStores,
    })

    const { data: storeTypes = [] } = useQuery({
        queryKey: ['store-types'],
        queryFn: StoreTypeController.getStoreTypes,
    })

    /* ───── mutations ───── */

    const createMutation = useMutation({
        mutationFn: StoreController.createStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.createSuccess'))
            setIsCreateOpen(false)
            createFormik.resetForm()
            setLogoPreview(null)
            setBannerPreview(null)
        },
        onError: () => toast.error(t('stores.createError')),
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Parameters<typeof StoreController.updateStore>[1] }) =>
            StoreController.updateStore(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.updateSuccess'))
            setIsEditOpen(false)
            setSelectedStore(null)
            setLogoPreview(null)
            setBannerPreview(null)
        },
        onError: () => toast.error(t('stores.updateError')),
    })

    const deleteMutation = useMutation({
        mutationFn: StoreController.deleteStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.deleteSuccess'))
            setIsDeleteOpen(false)
            setSelectedStore(null)
        },
        onError: () => toast.error(t('stores.deleteError')),
    })

    const toggleStatusMutation = useMutation({
        mutationFn: StoreController.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.toggleStatusSuccess'))
        },
    })

    const toggleVerifiedMutation = useMutation({
        mutationFn: StoreController.verifyStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.toggleVerifiedSuccess'))
        },
    })

    const toggleFeaturedMutation = useMutation({
        mutationFn: StoreController.toggleFeatured,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.toggleFeaturedSuccess'))
        },
    })

    /* ───── validation ───── */

    const storeValidation = Yup.object({
        name: Yup.string().min(2).required(t('stores.validation.nameRequired')),
        store_type_id: Yup.number().min(1, t('stores.validation.storeTypeRequired')).required(t('stores.validation.storeTypeRequired')),
        address: Yup.string().optional(),
        phone: Yup.string().optional(),
        start_time: Yup.string().optional(),
        end_time: Yup.string().optional(),
    })

    /* ───── create form ───── */

    const createFormik = useFormik({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            start_time: '',
            end_time: '',
            store_type_id: 0,
            logo: undefined as File | undefined,
            banner: undefined as File | undefined,
        },
        validationSchema: storeValidation,
        onSubmit: (values) => {
            createMutation.mutate({
                name: values.name,
                address: values.address || undefined,
                phone: values.phone || undefined,
                start_time: values.start_time || undefined,
                end_time: values.end_time || undefined,
                store_type_id: values.store_type_id,
                logo: values.logo,
                banner: values.banner,
            })
        },
    })

    /* ───── edit form ───── */

    const editFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: selectedStore?.name ?? '',
            address: selectedStore?.address ?? '',
            phone: selectedStore?.phone ?? '',
            start_time: selectedStore?.start_time ?? '',
            end_time: selectedStore?.end_time ?? '',
            store_type_id: selectedStore?.store_type_id ?? 0,
            logo: undefined as File | undefined,
            banner: undefined as File | undefined,
        },
        validationSchema: storeValidation,
        onSubmit: (values) => {
            if (!selectedStore) return
            updateMutation.mutate({
                id: selectedStore.id,
                data: {
                    name: values.name,
                    address: values.address || undefined,
                    phone: values.phone || undefined,
                    start_time: values.start_time || undefined,
                    end_time: values.end_time || undefined,
                    store_type_id: values.store_type_id,
                    logo: values.logo,
                    banner: values.banner,
                },
            })
        },
    })

    /* ───── handlers ───── */

    function openEdit(store: StoreType) {
        setSelectedStore(store)
        setLogoPreview(null)
        setBannerPreview(null)
        setIsEditOpen(true)
    }

    function openDelete(store: StoreType) {
        setSelectedStore(store)
        setIsDeleteOpen(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleFileChange(
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'logo' | 'banner',
        formik: any,
        setPreview: (v: string | null) => void
    ) {
        const file = e.target.files?.[0]
        if (file) {
            formik.setFieldValue(field, file)
            setPreview(URL.createObjectURL(file))
        }
    }

    /* ───── stats ───── */

    const total = stores.length
    const activeCount = stores.filter(s => s.is_active).length
    const verifiedCount = stores.filter(s => s.is_verified).length
    const featuredCount = stores.filter(s => s.is_featured).length

    /* ───── filtered ───── */

    const filtered = stores.filter(s =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.address ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    /* ───── shared form fields ───── */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function StoreForm({
        formik,
        logoPreviewUrl,
        bannerPreviewUrl,
        onLogoChange,
        onBannerChange,
        existingLogo,
        existingBanner,
    }: {
        formik: any;
        logoPreviewUrl: string | null;
        bannerPreviewUrl: string | null;
        onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        existingLogo?: string | null;
        existingBanner?: string | null;
    }) {
        return (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {/* Name */}
                <div className="space-y-1">
                    <Label htmlFor="name">{t('stores.name')} <span className="text-destructive">*</span></Label>
                    <Input
                        id="name"
                        placeholder={t('stores.namePlaceholder')}
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-destructive">{formik.errors.name}</p>
                    )}
                </div>

                {/* Store Type */}
                <div className="space-y-1">
                    <Label>{t('stores.storeType')} <span className="text-destructive">*</span></Label>
                    <Select
                        value={formik.values.store_type_id ? String(formik.values.store_type_id) : ''}
                        onValueChange={(v) => formik.setFieldValue('store_type_id', Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('stores.chooseStoreType')} />
                        </SelectTrigger>
                        <SelectContent>
                            {storeTypes.map((st) => (
                                <SelectItem key={st.id} value={String(st.id)}>
                                    {st.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.touched.store_type_id && formik.errors.store_type_id && (
                        <p className="text-xs text-destructive">{formik.errors.store_type_id}</p>
                    )}
                </div>

                {/* Address & Phone */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="address">{t('stores.address')}</Label>
                        <Input id="address" placeholder={t('stores.addressPlaceholder')} {...formik.getFieldProps('address')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">{t('stores.phone')}</Label>
                        <Input id="phone" placeholder={t('stores.phonePlaceholder')} {...formik.getFieldProps('phone')} />
                    </div>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="start_time">{t('stores.startTime')}</Label>
                        <Input id="start_time" type="time" {...formik.getFieldProps('start_time')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="end_time">{t('stores.endTime')}</Label>
                        <Input id="end_time" type="time" {...formik.getFieldProps('end_time')} />
                    </div>
                </div>

                {/* Logo */}
                <div className="space-y-2">
                    <Label>{t('stores.logo')}</Label>
                    <div className="flex items-center gap-4">
                        {(logoPreviewUrl || existingLogo) && (
                            <Image
                                src={logoPreviewUrl ?? existingLogo!}
                                alt="logo preview"
                                width={64}
                                height={64}
                                unoptimized
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                        )}
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border hover:border-primary rounded-lg p-3 text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                {logoPreviewUrl ? t('stores.changeImage') : t('stores.clickToUpload')}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
                        </label>
                    </div>
                </div>

                {/* Banner */}
                <div className="space-y-2">
                    <Label>{t('stores.banner')}</Label>
                    <div className="flex items-center gap-4">
                        {(bannerPreviewUrl || existingBanner) && (
                            <Image
                                src={bannerPreviewUrl ?? existingBanner!}
                                alt="banner preview"
                                width={96}
                                height={48}
                                unoptimized
                                className="w-24 h-12 object-cover rounded-lg border"
                            />
                        )}
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border hover:border-primary rounded-lg p-3 text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                {bannerPreviewUrl ? t('stores.changeImage') : t('stores.clickToUpload')}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={onBannerChange} />
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    /* ───── render ───── */

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Store className="h-6 w-6 text-primary" />
                        {t('stores.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('stores.subtitle')}</p>
                </div>
                <Button onClick={() => { setIsCreateOpen(true); createFormik.resetForm(); setLogoPreview(null); setBannerPreview(null) }} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('stores.add')}
                </Button>
            </div>

            {/* Stats */}
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

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9 pr-9"
                    placeholder={t('stores.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchQuery('')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">ID</TableHead>
                            <TableHead>{t('stores.store')}</TableHead>
                            <TableHead>{t('stores.storeType')}</TableHead>
                            <TableHead>{t('stores.owner')}</TableHead>
                            <TableHead>{t('stores.phone')}</TableHead>
                            <TableHead className="text-center">{t('stores.isActive')}</TableHead>
                            <TableHead className="text-center">{t('stores.isVerified')}</TableHead>
                            <TableHead className="text-center">{t('stores.isFeatured')}</TableHead>
                            <TableHead className="text-right">{t('stores.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-40 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Store className="h-10 w-10 opacity-30" />
                                        <p className="font-medium">
                                            {searchQuery ? t('stores.noResults') : t('stores.noStoresFound')}
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery ? t('stores.tryDifferentSearch') : t('stores.noStoresSubtitle')}
                                        </p>
                                        {searchQuery && (
                                            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                                                <X className="h-4 w-4 mr-1" /> {t('stores.clearSearch')}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((store) => (
                                <TableRow key={store.id} className="hover:bg-muted/30">
                                    <TableCell className="text-muted-foreground text-sm">{store.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <StoreImage src={store.logo} alt={store.name} />
                                            <div>
                                                <p className="font-medium text-foreground">{store.name}</p>
                                                {store.address && (
                                                    <p className="text-xs text-muted-foreground truncate max-w-48">{store.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.storeType?.name_en ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.user?.name ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.phone ?? '—'}
                                    </TableCell>
                                    {/* Active */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleStatusMutation.mutate(store.id)}
                                            disabled={toggleStatusMutation.isPending}
                                            title={store.is_active ? t('stores.active') : t('stores.inactive')}
                                        >
                                            {store.is_active
                                                ? <ToggleRight className="h-5 w-5 text-emerald-500 mx-auto" />
                                                : <ToggleLeft className="h-5 w-5 text-muted-foreground mx-auto" />}
                                        </button>
                                    </TableCell>
                                    {/* Verified */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleVerifiedMutation.mutate(store.id)}
                                            disabled={toggleVerifiedMutation.isPending}
                                            title={store.is_verified ? t('stores.verified') : t('stores.unverified')}
                                        >
                                            {store.is_verified
                                                ? <ShieldCheck className="h-5 w-5 text-blue-500 mx-auto" />
                                                : <ShieldOff className="h-5 w-5 text-muted-foreground mx-auto" />}
                                        </button>
                                    </TableCell>
                                    {/* Featured */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleFeaturedMutation.mutate(store.id)}
                                            disabled={toggleFeaturedMutation.isPending}
                                            title={store.is_featured ? t('stores.featured') : t('stores.unfeatured')}
                                        >
                                            <Star className={`h-5 w-5 mx-auto ${store.is_featured ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                onClick={() => openEdit(store)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => openDelete(store)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Create Dialog ── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('stores.add')}</DialogTitle>
                        <DialogDescription>{t('stores.addStoreSubtitle') || t('stores.subtitle')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createFormik.handleSubmit}>
                        <StoreForm
                            formik={createFormik}
                            logoPreviewUrl={logoPreview}
                            bannerPreviewUrl={bannerPreview}
                            onLogoChange={(e) => handleFileChange(e, 'logo', createFormik, setLogoPreview)}
                            onBannerChange={(e) => handleFileChange(e, 'banner', createFormik, setBannerPreview)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                {t('common.cancel') || 'Cancel'}
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <><Plus className="h-4 w-4 mr-1" /> {t('stores.createStore')}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Edit Dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) { setSelectedStore(null); setLogoPreview(null); setBannerPreview(null) } }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('stores.editStore')}</DialogTitle>
                        <DialogDescription>{selectedStore?.name}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editFormik.handleSubmit}>
                        <StoreForm
                            formik={editFormik}
                            logoPreviewUrl={logoPreview}
                            bannerPreviewUrl={bannerPreview}
                            existingLogo={selectedStore?.logo}
                            existingBanner={selectedStore?.banner}
                            onLogoChange={(e) => handleFileChange(e, 'logo', editFormik, setLogoPreview)}
                            onBannerChange={(e) => handleFileChange(e, 'banner', editFormik, setBannerPreview)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                {t('common.cancel') || 'Cancel'}
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>{t('stores.updateStore')}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Delete Dialog ── */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('stores.deleteConfirm')}</DialogTitle>
                        <DialogDescription>
                            {t('stores.deleteConfirmMessage')}
                            {selectedStore && (
                                <span className="block mt-1 font-semibold text-foreground">"{selectedStore.name}"</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel') || 'Cancel'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedStore && deleteMutation.mutate(selectedStore.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <><Trash2 className="h-4 w-4 mr-1" /> {t('common.delete') || 'Delete'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}