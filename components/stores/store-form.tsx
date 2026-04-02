import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image';

export default function StoreForm({
        formik,
        logoPreviewUrl,
        bannerPreviewUrl,
        onLogoChange,
        onBannerChange,
        existingLogo,
        existingBanner,
        storeTypes
    }: {
        formik: any;
        logoPreviewUrl: string | null;
        bannerPreviewUrl: string | null;
        onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        existingLogo?: string | null;
        existingBanner?: string | null;
        storeTypes: any[];
    }) {
    const {t}=useTranslation()    
  return (
   <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {/* Name */}
                <div className="space-y-1">
                    <Label htmlFor="name">{t('stores.name')} <span className="text-destructive">*</span></Label>
                    <Input
                        id="name"
                        placeholder={t('stores.namePlaceholder')}
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-destructive">{formik.errors.name}</p>
                    )}
                </div>


                {/* Store Type */}
                <div className="space-y-1">
                    <Label>{t('stores.storeType')} <span className="text-destructive">*</span></Label>
                    <Select
                        value={formik.values.store_type_id ? String(formik.values.store_type_id) : ''}
                        onValueChange={(v) => formik.setFieldValue('store_type_id', Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('stores.chooseStoreType')} />
                        </SelectTrigger>
                        <SelectContent>
                            {storeTypes.map((st) => (
                                <SelectItem key={st.id} value={String(st.id)}>
                                    {st.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.touched.store_type_id && formik.errors.store_type_id && (
                        <p className="text-xs text-destructive">{formik.errors.store_type_id}</p>
                    )}
                </div>

                {/* Address & Phone */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="address">{t('stores.address')}</Label>
                        <Input id="address" placeholder={t('stores.addressPlaceholder')} {...formik.getFieldProps('address')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">{t('stores.phone')}</Label>
                        <Input id="phone" placeholder={t('stores.phonePlaceholder')} {...formik.getFieldProps('phone')} />
                    </div>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="start_time">{t('stores.startTime')}</Label>
                        <Input id="start_time" type="time" {...formik.getFieldProps('start_time')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="end_time">{t('stores.endTime')}</Label>
                        <Input id="end_time" type="time" {...formik.getFieldProps('end_time')} />
                    </div>
                </div>

                {/* Logo */}
                <div className="space-y-2">
                    <Label>{t('stores.logo')}</Label>
                    <div className="flex items-center gap-4">
                        {(logoPreviewUrl || existingLogo) && (
                            <Image
                                src={logoPreviewUrl ?? existingLogo!}
                                alt="logo preview"
                                width={64}
                                height={64}
                                unoptimized
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                        )}
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border hover:border-primary rounded-lg p-3 text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                {logoPreviewUrl ? t('stores.changeImage') : t('stores.clickToUpload')}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
                        </label>
                    </div>
                </div>

                {/* Banner */}
                <div className="space-y-2">
                    <Label>{t('stores.banner')}</Label>
                    <div className="flex items-center gap-4">
                        {(bannerPreviewUrl || existingBanner) && (
                            <Image
                                src={bannerPreviewUrl ?? existingBanner!}
                                alt="banner preview"
                                width={96}
                                height={48}
                                unoptimized
                                className="w-24 h-12 object-cover rounded-lg border"
                            />
                        )}
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-border hover:border-primary rounded-lg p-3 text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                {bannerPreviewUrl ? t('stores.changeImage') : t('stores.clickToUpload')}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={onBannerChange} />
                        </label>
                    </div>
                </div>
            </div>
  )
}
