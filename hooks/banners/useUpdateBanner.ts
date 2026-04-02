import React, { useState } from 'react'
import BannerController from '@/controllers/banners-controller';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { Banner } from '@/controllers/banners-controller';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface BannerFormValues {
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    image: File | null;
}



export default function useUpdateBanner() {
     const [isEditOpen, setIsEditOpen] = useState(false);
     const [editingItem, setEditingItem] = useState<Banner | null>(null);
     const queryClient = useQueryClient();
     const { t } = useTranslation();

const validationSchema = Yup.object({
            title: Yup.string().required(t('banners.validation.titleRequired')),
            slug: Yup.string()
                .required(t('banners.validation.slugRequired'))
                .matches(/^[a-z0-9-]+$/, t('banners.validation.slugFormat')),
            content: Yup.string(),
            is_published: Yup.boolean(),
            image: Yup.mixed().nullable(),
        });
     const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            BannerController.updateBanner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            editFormik.resetForm();
            setIsEditOpen(false);
            setEditingItem(null);
            toast.success(t('banners.updateSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });


      const editFormik = useFormik<BannerFormValues>({
            initialValues: { title: '', slug: '', content: '', is_published: true, image: null },
            validationSchema,
            enableReinitialize: true,
            onSubmit: (values) => {
                if (!editingItem) return;
                updateMutation.mutate({
                    id: editingItem.id,
                    data: {
                        title: values.title,
                        slug: values.slug,
                        content: values.content || undefined,
                        is_published: values.is_published,
                        image: values.image ?? undefined,
                    },
                });
            },
        });


         const handleEdit = (item: Banner) => {
                setEditingItem(item);
                editFormik.setValues({
                    title: item.title,
                    slug: item.slug,
                    content: item.content ?? '',
                    is_published: item.is_published,
                    image: null,
                });
                setIsEditOpen(true);
            };
  return {
        editFormik,
        isEditOpen,
        setIsEditOpen,
        editingItem,
        setEditingItem,
        updateMutation,
        validationSchema,
        handleEdit
  }
}
