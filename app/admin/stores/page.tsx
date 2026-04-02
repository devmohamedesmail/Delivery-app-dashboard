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
import StoresStat from '@/components/stores/stores-stat'
import StoresHeader from '@/components/stores/stores-header'
import StoresSearch from '@/components/stores/stores-search'
import StoresTable from '@/components/stores/stores-table'
import StoreCreateDialog from '@/components/stores/store-create-dialog'
import StoreUpdateDialog from '@/components/stores/store-update-dialog'
import StoreDeleteDialog from '@/components/stores/store-delete-dialog'



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
            <StoresHeader
                setIsCreateOpen={setIsCreateOpen}
                createFormik={createFormik}
                setLogoPreview={setLogoPreview}
                setBannerPreview={setBannerPreview}
            />

            {/* Stats */}
            <StoresStat
                total={total}
                activeCount={activeCount}
                verifiedCount={verifiedCount}
                featuredCount={featuredCount}
            />

            {/* Search */}
            <StoresSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Table */}
            <StoresTable
                isLoading={isLoading}
                filtered={filtered}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                toggleStatusMutation={toggleStatusMutation}
                toggleVerifiedMutation={toggleVerifiedMutation}
                toggleFeaturedMutation={toggleFeaturedMutation}
                openEdit={openEdit}
                openDelete={openDelete}
            />

            {/* ── Create Dialog ── */}
            <StoreCreateDialog
                storeTypes={storeTypes}
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                createFormik={createFormik}
                createMutation={createMutation}
                logoPreview={logoPreview}
                bannerPreview={bannerPreview}
                handleFileChange={handleFileChange}
                setLogoPreview={setLogoPreview}
                setBannerPreview={setBannerPreview}
            />

            {/* ── Edit Dialog ── */}
            <StoreUpdateDialog
                isEditOpen={isEditOpen}
                setIsEditOpen={setIsEditOpen}
                selectedStore={selectedStore}
                editFormik={editFormik}
                updateMutation={updateMutation}
                logoPreview={logoPreview}
                bannerPreview={bannerPreview}
                handleFileChange={handleFileChange}
                storeTypes={storeTypes}
                setSelectedStore={setSelectedStore}
                setLogoPreview={setLogoPreview}
                setBannerPreview={setBannerPreview}
            />

            {/* ── Delete Dialog ── */}
            <StoreDeleteDialog
                isDeleteOpen={isDeleteOpen}
                setIsDeleteOpen={setIsDeleteOpen}
                selectedStore={selectedStore}
                deleteMutation={deleteMutation}
            />
        </div>
    )
}