import StoreController, { Store as StoreType } from '@/controllers/stores-controller'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function useUpdateStore() {
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<StoreType | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)

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


    const storeValidation = Yup.object({
        name: Yup.string().min(2).required(t('stores.validation.nameRequired')),
        store_type_id: Yup.number().min(1, t('stores.validation.storeTypeRequired')).required(t('stores.validation.storeTypeRequired')),
        address: Yup.string().optional(),
        phone: Yup.string().optional(),
        start_time: Yup.string().optional(),
        end_time: Yup.string().optional(),
    })

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



     function openEdit(store: StoreType) {
            setSelectedStore(store)
            setLogoPreview(null)
            setBannerPreview(null)
            setIsEditOpen(true)
        }

    return {
        updateMutation,
        editFormik,
        isEditOpen,
        setIsEditOpen,
        selectedStore,
        setSelectedStore,
        logoPreview,
        setLogoPreview,
        bannerPreview,
        setBannerPreview,
        storeValidation,
        t,
        openEdit
    }
}
