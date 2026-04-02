import React from 'react'
import { useMutation } from '@tanstack/react-query'
import StoreController from '@/controllers/stores-controller'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function useCreateStore() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)



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
    return {
        createMutation,
        createFormik,
        isCreateOpen,
        setIsCreateOpen,
        logoPreview,
        setLogoPreview,
        bannerPreview,
        setBannerPreview,
        storeValidation,
        t,
    }
}
