import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StoreForm from './store-form'

export default function StoreCreateDialog(
    { isCreateOpen, setIsCreateOpen, createFormik, createMutation, logoPreview, bannerPreview, handleFileChange, setLogoPreview, setBannerPreview, storeTypes }: any) {
    const { t } = useTranslation()
    return (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('stores.add')}</DialogTitle>
                    <DialogDescription>{t('stores.addStoreSubtitle') || t('stores.subtitle')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={createFormik.handleSubmit}>
                    <StoreForm
                        formik={createFormik}
                        storeTypes={storeTypes}
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
    )
}
