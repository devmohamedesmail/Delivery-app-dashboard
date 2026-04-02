import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function StoreDeleteDialog({isDeleteOpen, setIsDeleteOpen, selectedStore, deleteMutation}: any) {
    const { t } = useTranslation();
  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('stores.deleteConfirm')}</DialogTitle>
                        <DialogDescription>
                            {t('stores.deleteConfirmMessage')}
                            {selectedStore && (
                                <span className="block mt-1 font-semibold text-foreground">"{selectedStore.name}"</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel') || 'Cancel'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedStore && deleteMutation.mutate(selectedStore.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <><Trash2 className="h-4 w-4 mr-1" /> {t('common.delete') || 'Delete'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
  )
}
