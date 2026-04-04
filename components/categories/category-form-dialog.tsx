import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tag, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/controllers/categories-controller'

interface StoreTypeOption { id: number; name_en: string; name_ar: string }
interface CategoryFormProps {
    open: boolean
    onOpenChange: (o: boolean) => void
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void
    isPending: boolean
    storeTypes: StoreTypeOption[]
    title: string
    defaultValues?: Category
}

export default function CategoryFormDialog({ open, onOpenChange, onSubmit, isPending, storeTypes, title, defaultValues, }: CategoryFormProps) {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState(defaultValues?.name ?? '')
    const [description, setDescription] = useState(defaultValues?.description ?? '')
    const [storeTypeId, setStoreTypeId] = useState<string>(
        defaultValues?.store_type_id ? String(defaultValues.store_type_id) : ''
    )
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image ?? null)

    // Reset when dialog opens/closes or defaultValues changes
    React.useEffect(() => {
        setName(defaultValues?.name ?? '')
        setDescription(defaultValues?.description ?? '')
        setStoreTypeId(defaultValues?.store_type_id ? String(defaultValues.store_type_id) : '')
        setImageFile(null)
        setImagePreview(defaultValues?.image ?? null)
    }, [defaultValues, open])

    const handleFile = (file: File) => {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) { toast.error(t('categories.validation.nameRequired')); return }
        if (!storeTypeId) { toast.error(t('categories.validation.storeTypeRequired')); return }

        const data: CreateCategoryData | UpdateCategoryData = {
            name: name.trim(),
            description: description.trim() || undefined,
            store_type_id: Number(storeTypeId),
            ...(imageFile ? { image: imageFile } : {}),
        }
        onSubmit(data)
    }

  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{t('categories.formDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.name')} *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('categories.namePlaceholder')}
                        />
                    </div>

                    {/* Store Type */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.storeType')} *</Label>
                        <Select value={storeTypeId} onValueChange={setStoreTypeId}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('categories.selectStoreType')} />
                            </SelectTrigger>
                            <SelectContent>
                                {storeTypes.map((st) => (
                                    <SelectItem key={st.id} value={String(st.id)}>
                                        {st.name_en} - {st.name_ar}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.description')}</Label>
                        <textarea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder={t('categories.descriptionPlaceholder')}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label>{t('categories.image')}</Label>
                        <div
                            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/60 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <div className="relative h-28 w-28 rounded-lg overflow-hidden">
                                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 opacity-40" />
                                    <span className="text-sm">{t('categories.clickToUpload')}</span>
                                </div>
                            )}
                            {imagePreview && (
                                <span className="text-xs text-primary">{t('categories.changeImage')}</span>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? t('common.saving') : (defaultValues ? t('common.update') : t('common.create'))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
  )
}
