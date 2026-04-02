import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import BannerController from '@/controllers/banners-controller';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface BannerFormValues {
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    image: File | null;
}
export default function useCreateBanner() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
     const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createMutation = useMutation({
        mutationFn: BannerController.createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            createFormik.resetForm();
            setIsCreateOpen(false);
            toast.success(t('banners.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });


      const validationSchema = Yup.object({
            title: Yup.string().required(t('banners.validation.titleRequired')),
            slug: Yup.string()
                .required(t('banners.validation.slugRequired'))
                .matches(/^[a-z0-9-]+$/, t('banners.validation.slugFormat')),
            content: Yup.string(),
            is_published: Yup.boolean(),
            image: Yup.mixed().nullable(),
        });
    
        /* ================= CREATE FORMIK ================= */
        const createFormik = useFormik<BannerFormValues>({
            initialValues: { title: '', slug: '', content: '', is_published: true, image: null },
            validationSchema,
            onSubmit: (values) => {
                createMutation.mutate({
                    title: values.title,
                    slug: values.slug,
                    content: values.content || undefined,
                    is_published: values.is_published,
                    image: values.image ?? undefined,
                });
            },
        });
  return {
        createFormik,
        isCreateOpen,
        setIsCreateOpen,
        createMutation,
        validationSchema,
        
  }
}
