'use client'
import React, { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StoreTypeController from '@/controllers/store-types-controller';
import type { StoreType } from '@/controllers/store-types-controller';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Search, X, LayoutGrid, ImageIcon } from "lucide-react";
import toast from 'react-hot-toast';
import Image from 'next/image';

/* ========================= TYPES ========================= */

interface StoreTypeFormValues {
    name_en: string;
    name_ar: string;
    description: string;
    image: File | null;
}

/* ========================= IMAGE PREVIEW HELPER ========================= */

function ImagePreview({ file, existingUrl }: { file: File | null; existingUrl?: string | null }) {
    const [preview, setPreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (!file) { setPreview(null); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const src = preview ?? existingUrl;
    if (!src) return null;

    return (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm">
            <Image src={src} alt="preview" fill className="object-cover" />
        </div>
    );
}

/* ========================= STORE TYPE FORM ========================= */

interface StoreTypeFormProps {
    formik: ReturnType<typeof useFormik<StoreTypeFormValues>>;
    existingImageUrl?: string | null;
    isPending: boolean;
    submitLabel: string;
    onCancel: () => void;
}

function StoreTypeForm({ formik, existingImageUrl, isPending, submitLabel, onCancel }: StoreTypeFormProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Name English */}
            <div className="space-y-1">
                <Label htmlFor="name_en">{t('store-types.nameEn')}</Label>
                <Input
                    id="name_en"
                    name="name_en"
                    placeholder={t('store-types.nameEnPlaceholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name_en}
                />
                {formik.touched.name_en && formik.errors.name_en && (
                    <p className="text-xs text-red-500">{formik.errors.name_en}</p>
                )}
            </div>

            {/* Name Arabic */}
            <div className="space-y-1">
                <Label htmlFor="name_ar">{t('store-types.nameAr')}</Label>
                <Input
                    id="name_ar"
                    name="name_ar"
                    dir="rtl"
                    placeholder={t('store-types.nameArPlaceholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name_ar}
                />
                {formik.touched.name_ar && formik.errors.name_ar && (
                    <p className="text-xs text-red-500">{formik.errors.name_ar}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <Label htmlFor="description">{t('store-types.description')}</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder={t('store-types.descriptionPlaceholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label>{t('store-types.image')}</Label>

                {/* Preview row */}
                <div className="flex items-center gap-4">
                    <ImagePreview file={formik.values.image} existingUrl={existingImageUrl} />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-20 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
                    >
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-[10px] text-center leading-tight">
                            {formik.values.image || existingImageUrl
                                ? t('store-types.changeImage')
                                : t('store-types.clickToUpload')}
                        </span>
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        formik.setFieldValue('image', file);
                    }}
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
    );
}

/* ========================= MAIN PAGE ========================= */

export default function StoreTypesPage() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<StoreType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    /* ================= FETCH ================= */
    const { data: storeTypes, isLoading } = useQuery({
        queryKey: ['storeTypes'],
        queryFn: StoreTypeController.getStoreTypes,
    });

    /* ================= CREATE MUTATION ================= */
    const createMutation = useMutation({
        mutationFn: StoreTypeController.createStoreType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeTypes'] });
            createFormik.resetForm();
            setIsCreateOpen(false);
            toast.success(t('store-types.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });

    /* ================= UPDATE MUTATION ================= */
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            StoreTypeController.updateStoreType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeTypes'] });
            editFormik.resetForm();
            setIsEditOpen(false);
            setEditingItem(null);
            toast.success(t('store-types.updateSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });

    /* ================= DELETE MUTATION ================= */
    const deleteMutation = useMutation({
        mutationFn: StoreTypeController.deleteStoreType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeTypes'] });
            toast.success(t('store-types.deleteSuccess'));
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message;
            if (msg?.includes('store(s)')) {
                toast.error(t('store-types.cannotDelete'));
            } else {
                toast.error(msg || t('common.error'));
            }
        },
    });

    /* ================= VALIDATION SCHEMA ================= */
    const validationSchema = Yup.object({
        name_en: Yup.string().required(t('store-types.validation.nameEnRequired')),
        name_ar: Yup.string().required(t('store-types.validation.nameArRequired')),
        description: Yup.string(),
        image: Yup.mixed().nullable(),
    });

    /* ================= CREATE FORMIK ================= */
    const createFormik = useFormik<StoreTypeFormValues>({
        initialValues: { name_en: '', name_ar: '', description: '', image: null },
        validationSchema,
        onSubmit: (values) => {
            createMutation.mutate({
                name_en: values.name_en,
                name_ar: values.name_ar,
                description: values.description || undefined,
                image: values.image ?? undefined,
            });
        },
    });

    /* ================= EDIT FORMIK ================= */
    const editFormik = useFormik<StoreTypeFormValues>({
        initialValues: { name_en: '', name_ar: '', description: '', image: null },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!editingItem) return;
            updateMutation.mutate({
                id: editingItem.id,
                data: {
                    name_en: values.name_en,
                    name_ar: values.name_ar,
                    description: values.description || undefined,
                    image: values.image ?? undefined,
                },
            });
        },
    });

    /* ================= HANDLE EDIT ================= */
    const handleEdit = (item: StoreType) => {
        setEditingItem(item);
        editFormik.setValues({
            name_en: item.name_en,
            name_ar: item.name_ar,
            description: item.description ?? '',
            image: null,
        });
        setIsEditOpen(true);
    };

    /* ================= HANDLE DELETE ================= */
    const handleDelete = (id: number) => {
        if (confirm(t('store-types.deleteConfirmMessage'))) {
            deleteMutation.mutate(id);
        }
    };

    /* ================= SEARCH FILTER ================= */
    const filteredItems = useMemo(() => {
        if (!storeTypes) return [];
        if (!searchQuery.trim()) return storeTypes;
        const q = searchQuery.toLowerCase();
        return storeTypes.filter((st: StoreType) =>
            st.name_en.toLowerCase().includes(q) || st.name_ar.toLowerCase().includes(q)
        );
    }, [storeTypes, searchQuery]);

    /* ================= STATS ================= */
    const totalStoreTypes = storeTypes?.length ?? 0;

    /* ================= RENDER ================= */
    return (
        <div className="p-6 space-y-6">

            {/* ========== HEADER ========== */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('store-types.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('store-types.subtitle')}</p>
                </div>

                {/* CREATE DIALOG TRIGGER */}
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) createFormik.resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-md">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('store-types.add')}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{t('store-types.add')}</DialogTitle>
                        </DialogHeader>
                        <StoreTypeForm
                            formik={createFormik}
                            isPending={createMutation.isPending}
                            submitLabel={t('common.save')}
                            onCancel={() => { setIsCreateOpen(false); createFormik.resetForm(); }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* ========== STATS CARD ========== */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('store-types.totalStoreTypes')}
                        </CardTitle>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStoreTypes}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {filteredItems.length !== totalStoreTypes && (
                                <span>{filteredItems.length} {t('store-types.searchResults').toLowerCase()}</span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ========== SEARCH ========== */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('store-types.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={t('store-types.clearSearch')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* ========== EDIT DIALOG ========== */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) { editFormik.resetForm(); setEditingItem(null); }
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('store-types.editStoreType')}</DialogTitle>
                    </DialogHeader>
                    <StoreTypeForm
                        formik={editFormik}
                        existingImageUrl={editingItem?.image}
                        isPending={updateMutation.isPending}
                        submitLabel={t('common.update')}
                        onCancel={() => { setIsEditOpen(false); editFormik.resetForm(); setEditingItem(null); }}
                    />
                </DialogContent>
            </Dialog>

            {/* ========== TABLE ========== */}
            <Card className="shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-center font-semibold w-16">{t('common.id')}</TableHead>
                            <TableHead className="text-center font-semibold w-20">{t('store-types.image')}</TableHead>
                            <TableHead className="text-center font-semibold">{t('store-types.nameEn')}</TableHead>
                            <TableHead className="text-center font-semibold">{t('store-types.nameAr')}</TableHead>
                            <TableHead className="text-center font-semibold">{t('store-types.description')}</TableHead>
                            <TableHead className="text-center font-semibold w-28">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-muted-foreground">{t('common.loading')}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map((item: StoreType) => (
                                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="text-center font-medium">{item.id}</TableCell>

                                    {/* Image Cell */}
                                    <TableCell className="text-center">
                                        {item.image ? (
                                            <div className="inline-flex items-center justify-center">
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm border">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name_en}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-muted mx-auto">
                                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-center font-medium">{item.name_en}</TableCell>
                                    <TableCell className="text-center" dir="rtl">{item.name_ar}</TableCell>
                                    <TableCell className="text-center text-muted-foreground text-sm max-w-[200px] truncate">
                                        {item.description ?? <span className="text-muted-foreground/50">—</span>}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-center">
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3">
                                        {searchQuery ? (
                                            <>
                                                <Search className="w-12 h-12 text-muted-foreground/30" />
                                                <p className="text-lg font-medium text-muted-foreground">
                                                    {t('store-types.noResults')}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('store-types.tryDifferentSearch')}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSearchQuery('')}
                                                    className="mt-1"
                                                >
                                                    {t('store-types.clearSearch')}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <LayoutGrid className="w-12 h-12 text-muted-foreground/30" />
                                                <p className="text-lg font-medium text-muted-foreground">
                                                    {t('store-types.noStoreTypesFound')}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('store-types.noStoreTypesSubtitle')}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
