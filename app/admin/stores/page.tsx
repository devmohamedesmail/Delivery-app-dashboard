'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import useCreateStore from '@/hooks/stores/useCreateStore'
import useUpdateStore from '@/hooks/stores/useUpdateStore'
import useDeleteStore from '@/hooks/stores/useDeleteStore'



export default function StoresPage() {
    const {
        createMutation,
        createFormik,
        isCreateOpen,
        setIsCreateOpen,
        logoPreview,
        setLogoPreview,
        bannerPreview,
        setBannerPreview,
        t, } = useCreateStore()


    const {
        updateMutation,
        editFormik,
        isEditOpen,
        setIsEditOpen,
        selectedStore,
        setSelectedStore,
        openEdit
    } = useUpdateStore()

    const {
        deleteMutation,
        isDeleteOpen,
        setIsDeleteOpen,
        openDelete
    } = useDeleteStore()
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')


    /* ───── data fetching ───── */

    const { data: stores = [], isLoading } = useQuery<StoreType[]>({
        queryKey: ['stores'],
        queryFn: StoreController.getStores,
    })

    const { data: storeTypes = [] } = useQuery({
        queryKey: ['store-types'],
        queryFn: StoreTypeController.getStoreTypes,
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






    /* ───── handlers ───── */





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