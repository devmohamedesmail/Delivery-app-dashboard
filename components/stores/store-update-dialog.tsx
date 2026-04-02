import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import StoreForm from './store-form'


export default function StoreUpdateDialog({isEditOpen, setIsEditOpen, selectedStore, editFormik, updateMutation, logoPreview, bannerPreview, handleFileChange, storeTypes,setSelectedStore,setLogoPreview,setBannerPreview}: any) {
    const { t } = useTranslation();
  return (
     <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) { setSelectedStore(null); setLogoPreview(null); setBannerPreview(null) } }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('stores.editStore')}</DialogTitle>
                        <DialogDescription>{selectedStore?.name}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editFormik.handleSubmit}>
                        
                        <StoreForm
                            storeTypes={storeTypes}
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
  )
}
