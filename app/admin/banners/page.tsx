'use client'
import React, { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BannerController from '@/controllers/banners-controller';
import type { Banner } from '@/controllers/banners-controller';
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Search, X, ImageIcon, Image as ImageLucide, LayoutList } from "lucide-react";
import toast from 'react-hot-toast';
import Image from 'next/image';

/* ========================= FORM VALUES ========================= */

interface BannerFormValues {
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    image: File | null;
}

/* ========================= IMAGE PREVIEW ========================= */

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
        <div className="relative w-full h-36 rounded-lg overflow-hidden border shadow-sm">
            <Image src={src} alt="banner preview" fill className="object-cover" unoptimized={!!preview} />
        </div>
    );
}

/* ========================= SLUG AUTO-GENERATOR ========================= */

function toSlug(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/* ========================= BANNER FORM ========================= */

interface BannerFormProps {
    formik: ReturnType<typeof useFormik<BannerFormValues>>;
    existingImageUrl?: string | null;
    isPending: boolean;
    submitLabel: string;
    onCancel: () => void;
}

function BannerForm({ formik, existingImageUrl, isPending, submitLabel, onCancel }: BannerFormProps) {
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
    );
}

/* ========================= BANNER THUMBNAIL CELL ========================= */

function BannerThumbnail({ src }: { src?: string | null }) {
    if (!src) {
        return (
            <div className="inline-flex items-center justify-center w-16 h-10 rounded-md bg-muted mx-auto">
                <ImageLucide className="w-4 h-4 text-muted-foreground" />
            </div>
        );
    }
    return (
        <div className="inline-flex items-center justify-center">
            <div className="relative w-16 h-10 rounded-md overflow-hidden border shadow-sm">
                <Image src={src} alt="banner" fill className="object-cover" />
            </div>
        </div>
    );
}

/* ========================= MAIN PAGE ========================= */

export default function BannersPage() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Banner | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    /* ================= FETCH ================= */
    const { data: banners, isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: BannerController.getBanners,
    });

    /* ================= CREATE ================= */
    const createMutation = useMutation({
        mutationFn: BannerController.createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            createFormik.resetForm();
            setIsCreateOpen(false);
            toast.success(t('banners.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            BannerController.updateBanner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            editFormik.resetForm();
            setIsEditOpen(false);
            setEditingItem(null);
            toast.success(t('banners.updateSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: BannerController.deleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success(t('banners.deleteSuccess'));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.error'));
        },
    });

    /* ================= VALIDATION ================= */
    const validationSchema = Yup.object({
        title: Yup.string().required(t('banners.validation.titleRequired')),
        slug: Yup.string()
            .required(t('banners.validation.slugRequired'))
            .matches(/^[a-z0-9-]+$/, t('banners.validation.slugFormat')),
        content: Yup.string(),
        is_published: Yup.boolean(),
        image: Yup.mixed().nullable(),
    });

    /* ================= CREATE FORMIK ================= */
    const createFormik = useFormik<BannerFormValues>({
        initialValues: { title: '', slug: '', content: '', is_published: true, image: null },
        validationSchema,
        onSubmit: (values) => {
            createMutation.mutate({
                title: values.title,
                slug: values.slug,
                content: values.content || undefined,
                is_published: values.is_published,
                image: values.image ?? undefined,
            });
        },
    });

    /* ================= EDIT FORMIK ================= */
    const editFormik = useFormik<BannerFormValues>({
        initialValues: { title: '', slug: '', content: '', is_published: true, image: null },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!editingItem) return;
            updateMutation.mutate({
                id: editingItem.id,
                data: {
                    title: values.title,
                    slug: values.slug,
                    content: values.content || undefined,
                    is_published: values.is_published,
                    image: values.image ?? undefined,
                },
            });
        },
    });

    /* ================= HANDLE EDIT ================= */
    const handleEdit = (item: Banner) => {
        setEditingItem(item);
        editFormik.setValues({
            title: item.title,
            slug: item.slug,
            content: item.content ?? '',
            is_published: item.is_published,
            image: null,
        });
        setIsEditOpen(true);
    };

    /* ================= HANDLE DELETE ================= */
    const handleDelete = (id: number) => {
        if (confirm(t('banners.deleteConfirmMessage'))) {
            deleteMutation.mutate(id);
        }
    };

    /* ================= SEARCH ================= */
    const filteredItems = useMemo(() => {
        if (!banners) return [];
        if (!searchQuery.trim()) return banners;
        const q = searchQuery.toLowerCase();
        return banners.filter((b: Banner) =>
            b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
        );
    }, [banners, searchQuery]);

    /* ================= STATS ================= */
    const totalBanners = banners?.length ?? 0;
    const publishedCount = banners?.filter((b: Banner) => b.is_published).length ?? 0;
    const unpublishedCount = totalBanners - publishedCount;

    /* ================= RENDER ================= */
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('banners.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('banners.subtitle')}</p>
                </div>

                {/* CREATE DIALOG */}
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
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.totalBanners')}</CardTitle>
                        <LayoutList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBanners}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.published')}</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('banners.unpublished')}</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">{unpublishedCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('banners.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* EDIT DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) { editFormik.resetForm(); setEditingItem(null); }
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('banners.editBanner')}</DialogTitle>
                    </DialogHeader>
                    <BannerForm
                        formik={editFormik}
                        existingImageUrl={editingItem?.image}
                        isPending={updateMutation.isPending}
                        submitLabel={t('common.update')}
                        onCancel={() => { setIsEditOpen(false); editFormik.resetForm(); setEditingItem(null); }}
                    />
                </DialogContent>
            </Dialog>

            {/* TABLE */}
            <Card className="shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-center font-semibold w-14">{t('common.id')}</TableHead>
                            <TableHead className="text-center font-semibold w-20">{t('banners.image')}</TableHead>
                            <TableHead className="text-center font-semibold">{t('banners.title_field')}</TableHead>
                            <TableHead className="text-center font-semibold">{t('banners.slug')}</TableHead>
                            <TableHead className="text-center font-semibold w-28">{t('banners.is_published')}</TableHead>
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
                            filteredItems.map((item: Banner) => (
                                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="text-center font-medium">{item.id}</TableCell>

                                    <TableCell className="text-center">
                                        <BannerThumbnail src={item.image} />
                                    </TableCell>

                                    <TableCell className="text-center font-medium">{item.title}</TableCell>

                                    <TableCell className="text-center">
                                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                                            {item.slug}
                                        </code>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge
                                            variant={item.is_published ? 'default' : 'secondary'}
                                            className={item.is_published
                                                ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                                                : ''}
                                        >
                                            {item.is_published ? t('banners.published') : t('banners.unpublished')}
                                        </Badge>
                                    </TableCell>

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
                                                <p className="text-lg font-medium text-muted-foreground">{t('banners.noResults')}</p>
                                                <p className="text-sm text-muted-foreground">{t('banners.tryDifferentSearch')}</p>
                                                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="mt-1">
                                                    {t('banners.clearSearch')}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <ImageLucide className="w-12 h-12 text-muted-foreground/30" />
                                                <p className="text-lg font-medium text-muted-foreground">{t('banners.noBannersFound')}</p>
                                                <p className="text-sm text-muted-foreground">{t('banners.noBannersSubtitle')}</p>
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