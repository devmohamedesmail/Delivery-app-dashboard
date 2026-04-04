import React from 'react'
import { Card } from '@/components/ui/card'
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ImageIcon, Trash2, Pencil, FolderOpen } from 'lucide-react'
import Image from 'next/image'
export default function CategoriesTable({ isLoading, paginated, getStoreTypeName, setEditTarget, setDeleteTarget, search, setSearch }: { isLoading: boolean, paginated: any[], getStoreTypeName: (id: number) => string, setEditTarget: (cat: any) => void, setDeleteTarget: (cat: any) => void, search: string, setSearch: (search: string) => void, setPage: (page: number) => void }) {
    const { t } = useTranslation()
    
    return (
        <Card className="shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold w-14 text-center">#</TableHead>
                        <TableHead className="font-semibold w-16">{t('categories.image')}</TableHead>
                        <TableHead className="font-semibold text-start">{t('categories.name')}</TableHead>
                        <TableHead className="font-semibold text-start">{t('categories.description')}</TableHead>
                        <TableHead className="font-semibold text-start">{t('categories.storeType')}</TableHead>
                        <TableHead className="font-semibold text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-muted-foreground">{t('common.loading')}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : paginated.length > 0 ? (
                        paginated.map((cat) => (
                            <TableRow key={cat.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="text-center font-medium text-muted-foreground">
                                    {cat.id}
                                </TableCell>
                                <TableCell>
                                    {cat.image ? (
                                        <div className="relative h-10 w-10 rounded-lg overflow-hidden border">
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center">
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                    {cat.description ?? '—'}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {getStoreTypeName(cat.store_type_id)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                            onClick={() => setEditTarget(cat)}
                                            title={t('common.edit')}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                            onClick={() => setDeleteTarget(cat)}
                                            title={t('common.delete')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-16">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <FolderOpen className="h-12 w-12 opacity-25" />
                                    <p className="font-medium text-base">
                                        {search ? t('categories.noResults') : t('categories.noCategories')}
                                    </p>
                                    {search && (
                                        <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                                            {t('categories.clearSearch')}
                                        </Button>
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