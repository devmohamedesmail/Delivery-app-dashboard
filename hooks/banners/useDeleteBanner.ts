import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import BannerController from '@/controllers/banners-controller';

export default function useDeleteBanner() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
      const deleteMutation = useMutation({
            mutationFn: BannerController.deleteBanner,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['banners'] });
                toast.success(t('banners.deleteSuccess'));
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || t('common.error'));
            },
        });


         const handleDelete = (id: number) => {
                if (confirm(t('banners.deleteConfirmMessage'))) {
                    deleteMutation.mutate(id);
                }
            };
  return {
        deleteMutation,
        handleDelete
  }
}
