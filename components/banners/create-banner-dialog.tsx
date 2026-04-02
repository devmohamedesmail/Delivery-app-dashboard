import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import BannerForm from './banner-form'
export default function CreateBannerDialog({ isCreateOpen, setIsCreateOpen, createFormik, createMutation }: { isCreateOpen: boolean, setIsCreateOpen: (open: boolean) => void, createFormik: any, createMutation: any }) {
    const { t } = useTranslation();
    return (
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) createFormik.resetForm();
        }}>
            <DialogTrigger asChild>
                <Button size="lg" className="shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('banners.add')}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('banners.add')}</DialogTitle>
                </DialogHeader>
                <BannerForm
                    formik={createFormik}
                    isPending={createMutation.isPending}
                    submitLabel={t('common.save')}
                    onCancel={() => { setIsCreateOpen(false); createFormik.resetForm(); }}
                />
            </DialogContent>
        </Dialog>
    )
}
