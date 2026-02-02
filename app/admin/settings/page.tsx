'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import toast from 'react-hot-toast'
import { config } from '@/constants/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Upload, Image as ImageIcon, Loader2, Save, AlertCircle, Globe, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

interface SettingData {
    id: number
    name_ar: string
    name_en: string
    logo: string | null
    banner: string | null
    version: string
    description: string
    url: string
    email: string
    phone: string
    address: string
    facebook: string
    instagram: string
    twitter: string
    whatsapp: string
    telegram: string
    support_phone: string | null
    support_chat: string | null
    support_email: string | null
    support_address: string | null
    support_hours: string | null
    support_whatsapp: string | null
    maintenance_mode: boolean
    maintenance_message: string | null
}

export default function SettingsPage() {
    const { t } = useTranslation()
    const [cookies] = useCookies(['access_token'])
    const [loading, setLoading] = useState(true)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    const validationSchema = Yup.object({
        name_en: Yup.string()
            .required(t('settings.validation.appNameRequired'))
            .min(2, t('settings.validation.appNameMin')),
        name_ar: Yup.string()
            .required(t('settings.validation.appNameRequired'))
            .min(2, t('settings.validation.appNameMin')),
        version: Yup.string().required(t('settings.validation.valueRequired')),
        description: Yup.string().required(t('settings.validation.valueRequired')),
        url: Yup.string().url(t('settings.validation.urlInvalid')).required(t('settings.validation.valueRequired')),
        email: Yup.string().email(t('settings.validation.emailInvalid')).required(t('settings.validation.valueRequired')),
        phone: Yup.string().required(t('settings.validation.valueRequired')),
        address: Yup.string().required(t('settings.validation.valueRequired')),
        facebook: Yup.string().url(t('settings.validation.urlInvalid')).nullable().transform((value) => value || null),
        instagram: Yup.string().url(t('settings.validation.urlInvalid')).nullable().transform((value) => value || null),
        twitter: Yup.string().url(t('settings.validation.urlInvalid')).nullable().transform((value) => value || null),
        whatsapp: Yup.string().nullable(),
        telegram: Yup.string().nullable(),
        support_phone: Yup.string().nullable(),
        support_email: Yup.string().email(t('settings.validation.emailInvalid')).nullable().transform((value) => value || null),
        support_chat: Yup.string().url(t('settings.validation.urlInvalid')).nullable().transform((value) => value || null),
        support_address: Yup.string().nullable(),
        support_hours: Yup.string().nullable(),
        support_whatsapp: Yup.string().nullable(),
        maintenance_message: Yup.string().when('maintenance_mode', {
            is: true,
            then: (schema) => schema.required(t('settings.validation.maintenanceMessageRequired')),
            otherwise: (schema) => schema.nullable(),
        }),
    })

    const formik = useFormik({
        initialValues: {
            name_en: '',
            name_ar: '',
            version: '',
            description: '',
            url: '',
            email: '',
            phone: '',
            address: '',
            facebook: '',
            instagram: '',
            twitter: '',
            whatsapp: '',
            telegram: '',
            support_phone: '',
            support_email: '',
            support_chat: '',
            support_address: '',
            support_hours: '',
            support_whatsapp: '',
            maintenance_mode: false,
            maintenance_message: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData()

                // Append all text fields, but only if they have values
                Object.keys(values).forEach((key) => {
                    const value = values[key as keyof typeof values]

                    // Handle boolean values specially
                    if (key === 'maintenance_mode') {
                        // Always append maintenance_mode, convert boolean to string
                        formData.append(key, value ? 'true' : 'false')
                    } else if (value !== null && value !== undefined && value !== '') {
                        // Skip empty strings and null values for other fields
                        formData.append(key, String(value))
                    }
                })

                // Append files
                if (logoFile) {
                    formData.append('logo', logoFile)
                }
                if (bannerFile) {
                    formData.append('banner', bannerFile)
                }

                console.log('Submitting form data...')

                // Always update with ID 1
                const response = await axios.put(
                    `${config.API_URL}/settings/update/1`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${cookies.access_token}`,
                        },
                    }
                )

                if (response.data.success) {
                    toast.success(t('settings.updateSuccess'))
                    // Clear file states after successful upload
                    setLogoFile(null)
                    setBannerFile(null)
                    fetchSettings()
                }
            } catch (error: any) {
                console.log('Error saving settings:', error)
                console.log('Error response:', error.response?.data)
                toast.error(error.response?.data?.message || t('settings.errorSaving'))
            }
        },
    })

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${config.API_URL}/settings`)

            if (response.data.success && response.data.data) {
                const setting = response.data.data
                formik.setValues({
                    name_en: setting.name_en || '',
                    name_ar: setting.name_ar || '',
                    version: setting.version || '',
                    description: setting.description || '',
                    url: setting.url || '',
                    email: setting.email || '',
                    phone: setting.phone || '',
                    address: setting.address || '',
                    facebook: setting.facebook || '',
                    instagram: setting.instagram || '',
                    twitter: setting.twitter || '',
                    whatsapp: setting.whatsapp || '',
                    telegram: setting.telegram || '',
                    support_phone: setting.support_phone || '',
                    support_email: setting.support_email || '',
                    support_chat: setting.support_chat || '',
                    support_address: setting.support_address || '',
                    support_hours: setting.support_hours || '',
                    support_whatsapp: setting.support_whatsapp || '',
                    maintenance_mode: setting.maintenance_mode || false,
                    maintenance_message: setting.maintenance_message || '',
                })
                setLogoPreview(setting.logo)
                setBannerPreview(setting.banner)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error(t('settings.errorLoading'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setBannerPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {t('settings.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('settings.subtitle')}</p>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1">
                        <TabsTrigger value="general">{t('settings.generalSettings')}</TabsTrigger>
                        <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
                        <TabsTrigger value="contact">{t('settings.contactInfo')}</TabsTrigger>
                        <TabsTrigger value="social">{t('settings.socialMedia')}</TabsTrigger>
                        <TabsTrigger value="support">{t('settings.supportInfo')}</TabsTrigger>
                    </TabsList>

                    {/* General Settings Tab */}
                    <TabsContent value="general" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">{t('settings.generalSettings')}</CardTitle>
                                <CardDescription>{t('settings.basicInfo')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* App Name English */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name_en" className="text-sm font-medium">
                                            {t('settings.appNameEn')}
                                        </Label>
                                        <Input
                                            id="name_en"
                                            name="name_en"
                                            type="text"
                                            placeholder={t('settings.appNamePlaceholder')}
                                            value={formik.values.name_en}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.name_en && formik.errors.name_en && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.name_en}
                                            </p>
                                        )}
                                    </div>

                                    {/* App Name Arabic */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name_ar" className="text-sm font-medium">
                                            {t('settings.appNameAr')}
                                        </Label>
                                        <Input
                                            id="name_ar"
                                            name="name_ar"
                                            type="text"
                                            placeholder={t('settings.appNamePlaceholder')}
                                            value={formik.values.name_ar}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.name_ar && formik.errors.name_ar && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.name_ar}
                                            </p>
                                        )}
                                    </div>

                                    {/* Version */}
                                    <div className="space-y-2">
                                        <Label htmlFor="version" className="text-sm font-medium">
                                            {t('settings.version')}
                                        </Label>
                                        <Input
                                            id="version"
                                            name="version"
                                            type="text"
                                            placeholder={t('settings.versionPlaceholder')}
                                            value={formik.values.version}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.version && formik.errors.version && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.version}
                                            </p>
                                        )}
                                    </div>

                                    {/* URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            {t('settings.url')}
                                        </Label>
                                        <Input
                                            id="url"
                                            name="url"
                                            type="url"
                                            placeholder={t('settings.urlPlaceholder')}
                                            value={formik.values.url}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.url && formik.errors.url && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.url}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        {t('settings.description')}
                                    </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        type="text"
                                        placeholder={t('places.enterDescription')}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="h-11"
                                    />
                                    {formik.touched.description && formik.errors.description && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Maintenance Mode */}
                                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <Checkbox
                                            id="maintenance_mode"
                                            checked={formik.values.maintenance_mode}
                                            onCheckedChange={(checked) =>
                                                formik.setFieldValue('maintenance_mode', checked)
                                            }
                                        />
                                        <label
                                            htmlFor="maintenance_mode"
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {t('settings.enableMaintenance')}
                                        </label>
                                    </div>

                                    {formik.values.maintenance_mode && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label htmlFor="maintenance_message" className="text-sm font-medium">
                                                {t('settings.maintenanceMessage')}
                                            </Label>
                                            <Input
                                                id="maintenance_message"
                                                name="maintenance_message"
                                                type="text"
                                                placeholder={t('settings.maintenanceMessagePlaceholder')}
                                                value={formik.values.maintenance_message}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="h-11"
                                            />
                                            {formik.touched.maintenance_message && formik.errors.maintenance_message && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {formik.errors.maintenance_message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">{t('settings.appearance')}</CardTitle>
                                <CardDescription>{t('settings.uploadImages')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('settings.logo')}</Label>
                                    <div className="flex items-start gap-4">
                                        {logoPreview ? (
                                            <div className="relative w-32 h-32 rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {logoPreview ? t('settings.currentLogo') : t('settings.noLogo')}
                                            </p>
                                            <label htmlFor="logo-upload">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg cursor-pointer transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    {t('settings.uploadLogo')}
                                                </div>
                                                <input
                                                    id="logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Banner Upload */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('settings.banner')}</Label>
                                    <div className="space-y-4">
                                        {bannerPreview ? (
                                            <div className="relative w-full h-40 rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                        <label htmlFor="banner-upload">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg cursor-pointer transition-colors">
                                                <Upload className="w-4 h-4" />
                                                {t('settings.uploadBanner')}
                                            </div>
                                            <input
                                                id="banner-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Info Tab */}
                    <TabsContent value="contact" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">{t('settings.contactInfo')}</CardTitle>
                                <CardDescription>{t('settings.primaryContact')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {t('settings.email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={t('settings.emailPlaceholder')}
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {t('settings.phone')}
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder={t('settings.phonePlaceholder')}
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {t('settings.address')}
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder={t('settings.addressPlaceholder')}
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="h-11"
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.address}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Media Tab */}
                    <TabsContent value="social" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">{t('settings.socialMedia')}</CardTitle>
                                <CardDescription>{t('settings.socialLinks')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Facebook */}
                                    <div className="space-y-2">
                                        <Label htmlFor="facebook" className="text-sm font-medium">
                                            {t('settings.facebook')}
                                        </Label>
                                        <Input
                                            id="facebook"
                                            name="facebook"
                                            type="url"
                                            placeholder={t('settings.facebookPlaceholder')}
                                            value={formik.values.facebook}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.facebook && formik.errors.facebook && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.facebook}
                                            </p>
                                        )}
                                    </div>

                                    {/* Instagram */}
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram" className="text-sm font-medium">
                                            {t('settings.instagram')}
                                        </Label>
                                        <Input
                                            id="instagram"
                                            name="instagram"
                                            type="url"
                                            placeholder={t('settings.instagramPlaceholder')}
                                            value={formik.values.instagram}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.instagram && formik.errors.instagram && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.instagram}
                                            </p>
                                        )}
                                    </div>

                                    {/* Twitter */}
                                    <div className="space-y-2">
                                        <Label htmlFor="twitter" className="text-sm font-medium">
                                            {t('settings.twitter')}
                                        </Label>
                                        <Input
                                            id="twitter"
                                            name="twitter"
                                            type="url"
                                            placeholder={t('settings.twitterPlaceholder')}
                                            value={formik.values.twitter}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.twitter && formik.errors.twitter && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.twitter}
                                            </p>
                                        )}
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp" className="text-sm font-medium flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            {t('settings.whatsapp')}
                                        </Label>
                                        <Input
                                            id="whatsapp"
                                            name="whatsapp"
                                            type="tel"
                                            placeholder={t('settings.whatsappPlaceholder')}
                                            value={formik.values.whatsapp}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Telegram */}
                                    <div className="space-y-2">
                                        <Label htmlFor="telegram" className="text-sm font-medium">
                                            {t('settings.telegram')}
                                        </Label>
                                        <Input
                                            id="telegram"
                                            name="telegram"
                                            type="text"
                                            placeholder={t('settings.telegramPlaceholder')}
                                            value={formik.values.telegram}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Support Info Tab */}
                    <TabsContent value="support" className="space-y-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">{t('settings.supportInfo')}</CardTitle>
                                <CardDescription>{t('settings.supportDetails')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Support Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_phone" className="text-sm font-medium">
                                            {t('settings.supportPhone')}
                                        </Label>
                                        <Input
                                            id="support_phone"
                                            name="support_phone"
                                            type="tel"
                                            placeholder={t('settings.supportPhonePlaceholder')}
                                            value={formik.values.support_phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Support Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_email" className="text-sm font-medium">
                                            {t('settings.supportEmail')}
                                        </Label>
                                        <Input
                                            id="support_email"
                                            name="support_email"
                                            type="email"
                                            placeholder={t('settings.supportEmailPlaceholder')}
                                            value={formik.values.support_email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.support_email && formik.errors.support_email && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.support_email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Support WhatsApp */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_whatsapp" className="text-sm font-medium">
                                            {t('settings.supportWhatsapp')}
                                        </Label>
                                        <Input
                                            id="support_whatsapp"
                                            name="support_whatsapp"
                                            type="tel"
                                            placeholder={t('settings.supportWhatsappPlaceholder')}
                                            value={formik.values.support_whatsapp}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Support Chat */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_chat" className="text-sm font-medium">
                                            {t('settings.supportChat')}
                                        </Label>
                                        <Input
                                            id="support_chat"
                                            name="support_chat"
                                            type="url"
                                            placeholder={t('settings.supportChatPlaceholder')}
                                            value={formik.values.support_chat}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                        {formik.touched.support_chat && formik.errors.support_chat && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {formik.errors.support_chat}
                                            </p>
                                        )}
                                    </div>

                                    {/* Support Hours */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_hours" className="text-sm font-medium">
                                            {t('settings.supportHours')}
                                        </Label>
                                        <Input
                                            id="support_hours"
                                            name="support_hours"
                                            type="text"
                                            placeholder={t('settings.supportHoursPlaceholder')}
                                            value={formik.values.support_hours}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                {/* Support Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="support_address" className="text-sm font-medium">
                                        {t('settings.supportAddress')}
                                    </Label>
                                    <Input
                                        id="support_address"
                                        name="support_address"
                                        type="text"
                                        placeholder={t('settings.supportAddressPlaceholder')}
                                        value={formik.values.support_address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="h-11"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-white px-8 h-11 shadow-lg"
                    >
                        {formik.isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {t('common.saving')}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                {t('settings.updateSettings')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
