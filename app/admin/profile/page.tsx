'use client'
import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { config } from '@/constants/config'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, Camera, Loader2, Edit, X } from 'lucide-react'
import Loading from '@/components/ui/loading'

interface UserProfile {
    id: number
    name: string
    email: string | null
    phone: string | null
    avatar: string | null
    role: {
        id: number
        role: string
    }
}

export default function ProfilePage() {
    const [cookies] = useCookies(['access_token'])
    const { t } = useTranslation()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${config.API_URL}/auth/get-profile`, {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                },
            })

            if (response.data.success) {
                setProfile(response.data.user)
                setAvatarPreview(response.data.user.avatar)
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            toast.error(t('profile.errorLoading'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    // Validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required(t('profile.validation.nameRequired')).min(2, t('profile.validation.nameMin')),
        email: Yup.string().email(t('profile.validation.emailInvalid')).nullable(),
        phone: Yup.string().nullable(),
    })

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phone || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData()

                // Append text fields
                if (values.name) formData.append('name', values.name)
                if (values.email) formData.append('email', values.email)
                if (values.phone) formData.append('phone', values.phone)

                // Append avatar if changed
                if (avatarFile) {
                    formData.append('avatar', avatarFile)
                }

                const response = await axios.put(
                    `${config.API_URL}/auth/update-profile`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${cookies.access_token}`,
                        },
                    }
                )

                if (response.data.success) {
                    toast.success(t('profile.updateSuccess'))
                    setProfile(response.data.user)
                    setAvatarFile(null)
                    setIsEditing(false)
                    fetchProfile()
                }
            } catch (error: any) {
                console.error('Error updating profile:', error)
                toast.error(error.response?.data?.message || t('profile.errorSaving'))
            }
        },
    })

    // Handle avatar change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-6  mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {t('profile.title')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">{t('profile.subtitle')}</p>
                    </div>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('common.edit')}
                    </Button>
                )}
            </div>

            {/* Profile Card */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">{t('profile.personalInfo')}</CardTitle>
                    <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary">
                                            <User className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {profile?.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                    {profile?.role.role}
                                </p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {t('profile.name')}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!isEditing}
                                    placeholder={t('profile.namePlaceholder')}
                                    className={
                                        formik.touched.name && formik.errors.name
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {t('profile.email')}
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!isEditing}
                                    placeholder={t('profile.emailPlaceholder')}
                                    className={
                                        formik.touched.email && formik.errors.email
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {t('profile.phone')}
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formik.values.phone || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!isEditing}
                                    placeholder={t('profile.phonePlaceholder')}
                                    className={
                                        formik.touched.phone && formik.errors.phone
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className="text-sm text-red-500">{formik.errors.phone}</p>
                                )}
                            </div>

                            {/* Role (Read-only) */}
                            <div className="space-y-2">
                                <Label>{t('profile.role')}</Label>
                                <Input
                                    value={profile?.role.role || ''}
                                    disabled
                                    className="capitalize bg-slate-50 dark:bg-slate-900"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false)
                                        formik.resetForm()
                                        setAvatarFile(null)
                                        setAvatarPreview(profile?.avatar || null)
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {formik.isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('common.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-4 h-4 mr-2" />
                                            {t('profile.saveChanges')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
