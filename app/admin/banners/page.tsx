'use client'

import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import BannerForm from '@/components/banners/banner-form';
import CreateBannerDialog from '@/components/banners/create-banner-dialog';
import BannersStat from '@/components/banners/banners-stat';
import BannerSearch from '@/components/banners/banner-search';
import BannersTable from '@/components/banners/banners-table';
import useCreateBanner from '@/hooks/banners/useCreateBanner';
import useUpdateBanner from '@/hooks/banners/useUpdateBanner';
import useDeleteBanner from '@/hooks/banners/useDeleteBanner';
import useBanners from '@/hooks/banners/useBanners';
















export default function BannersPage() {
    const { t } = useTranslation();
    const {banners,isLoading,searchQuery,setSearchQuery,filteredItems,totalBanners,publishedCount,unpublishedCount}=useBanners();
    const {
        createFormik,
        isCreateOpen,
        setIsCreateOpen,
        createMutation,
    } = useCreateBanner()

    const {
        editFormik,
        isEditOpen,
        setIsEditOpen,
        editingItem,
        setEditingItem,
        updateMutation,
        handleEdit
    } = useUpdateBanner();


    const { deleteMutation, handleDelete } = useDeleteBanner()

    /* ================= RENDER ================= */
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('banners.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('banners.subtitle')}</p>
                </div>


                <CreateBannerDialog
                    isCreateOpen={isCreateOpen}
                    setIsCreateOpen={setIsCreateOpen}
                    createFormik={createFormik}
                    createMutation={createMutation}
                />
            </div>

            {/* STATS */}
            <BannersStat totalBanners={totalBanners} publishedCount={publishedCount} unpublishedCount={unpublishedCount} />

            {/* SEARCH */}
            <BannerSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* EDIT DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) { editFormik.resetForm(); setEditingItem(null); }
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('banners.editBanner')}</DialogTitle>
                    </DialogHeader>
                    <BannerForm
                        formik={editFormik}
                        existingImageUrl={editingItem?.image}
                        isPending={updateMutation.isPending}
                        submitLabel={t('common.update')}
                        onCancel={() => { setIsEditOpen(false); editFormik.resetForm(); setEditingItem(null); }}
                    />
                </DialogContent>
            </Dialog>

            {/* TABLE */}
            <BannersTable
                isLoading={isLoading}
                filteredItems={filteredItems}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                deleteMutation={deleteMutation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        </div>
    );
}