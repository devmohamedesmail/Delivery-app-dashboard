import React from 'react'
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash2, Search, Image as ImageLucide } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Banner } from '@/controllers/banners-controller';
import BannerThumbnail from './banner-thumbnail';

export default function BannersTable({ isLoading, filteredItems, handleEdit, handleDelete, deleteMutation, searchQuery, setSearchQuery }: {
    isLoading: boolean;
    filteredItems: Banner[];
    handleEdit: (item: Banner) => void;
    handleDelete: (id: number) => void;
    deleteMutation: any;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}) {
    const { t } = useTranslation();
  return (
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
  )
}
