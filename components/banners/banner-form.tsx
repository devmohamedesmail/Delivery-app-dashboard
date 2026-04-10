import React, { useRef } from 'react'
import { useFormik } from 'formik'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { ImageIcon } from 'lucide-react';
import ImagePreview from './image-preview';
import { BannerFormValues, BannerFormProps } from '@/types/banner';


// interface BannerFormValues {
//     title: string;
//     slug: string;
//     content: string;
//     is_published: boolean;
//     image: File | null;
//     link: string | null;
// }

// interface BannerFormProps {
//     formik: ReturnType<typeof useFormik<BannerFormValues>>;
//     existingImageUrl?: string | null;
//     isPending: boolean;
//     submitLabel: string;
//     onCancel: () => void;
// }


function toSlug(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
export default function BannerForm({ formik, existingImageUrl, isPending, submitLabel, onCancel }: BannerFormProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        formik.setFieldValue('title', val);
        // Auto-fill slug only if slug is still empty or matches previous auto-gen
        if (!formik.touched.slug || formik.values.slug === toSlug(formik.values.title)) {
            formik.setFieldValue('slug', toSlug(val));
        }
    };


    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Title */}
            <div className="space-y-1">
                <Label htmlFor="title">{t('banners.title_field')}</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder={t('banners.titlePlaceholder')}
                    value={formik.values.title}
                    onChange={handleTitleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                    <p className="text-xs text-red-500">{formik.errors.title}</p>
                )}
            </div>

            {/* Slug */}
            <div className="space-y-1">
                <Label htmlFor="slug">{t('banners.slug')}</Label>
                <Input
                    id="slug"
                    name="slug"
                    placeholder={t('banners.slugPlaceholder')}
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.slug && formik.errors.slug && (
                    <p className="text-xs text-red-500">{formik.errors.slug}</p>
                )}
            </div>

            {/* Content */}
            <div className="space-y-1">
                <Label htmlFor="content">{t('banners.content')}</Label>
                <textarea
                    id="content"
                    name="content"
                    rows={3}
                    placeholder={t('banners.contentPlaceholder')}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>



            <div className="space-y-1">
                <Label htmlFor="link">{t('banners.link')}</Label>
                <Input
                    id="link"
                    name="link"
                    placeholder={t('banners.linkPlaceholder')}
                    value={formik.values.link ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.link && formik.errors.link && (
                    <p className="text-xs text-red-500">{formik.errors.link}</p>
                )}
            </div>

            {/* Published toggle */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_published"
                    checked={formik.values.is_published}
                    onChange={(e) => formik.setFieldValue('is_published', e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-primary"
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                    {t('banners.is_published')}
                </Label>
            </div>

            {/* Image */}
            <div className="space-y-2">
                <Label>{t('banners.image')}</Label>
                <ImagePreview file={formik.values.image} existingUrl={existingImageUrl} />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg w-full justify-center hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary text-sm"
                >
                    <ImageIcon className="w-4 h-4" />
                    {formik.values.image || existingImageUrl
                        ? t('banners.changeImage')
                        : t('banners.clickToUpload')}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => formik.setFieldValue('image', e.target.files?.[0] ?? null)}
                />
            </div>

            <DialogFooter>
                <Button variant="outline" type="button" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? t('common.saving') : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    )
}
