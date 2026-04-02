import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import { Store } from 'lucide-react'
import {Button} from '@/components/ui/button'
import { Pencil, Trash2, ToggleLeft, ToggleRight, ShieldCheck, ShieldOff,X,Star } from 'lucide-react'
import StoreImage from './store-image'

export default function StoresTable({isLoading, filtered, searchQuery, setSearchQuery, toggleStatusMutation, toggleVerifiedMutation, toggleFeaturedMutation, openEdit, openDelete}: {isLoading: boolean, filtered: any[], searchQuery: string, setSearchQuery: (query: string) => void, toggleStatusMutation: any, toggleVerifiedMutation: any, toggleFeaturedMutation: any, openEdit: (store: any) => void, openDelete: (store: any) => void}) {
    const { t } = useTranslation()
  return (
     <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">ID</TableHead>
                            <TableHead>{t('stores.store')}</TableHead>
                            <TableHead>{t('stores.storeType')}</TableHead>
                            <TableHead>{t('stores.owner')}</TableHead>
                            <TableHead>{t('stores.phone')}</TableHead>
                            <TableHead className="text-center">{t('stores.isActive')}</TableHead>
                            <TableHead className="text-center">{t('stores.isVerified')}</TableHead>
                            <TableHead className="text-center">{t('stores.isFeatured')}</TableHead>
                            <TableHead className="text-right">{t('stores.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-40 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Store className="h-10 w-10 opacity-30" />
                                        <p className="font-medium">
                                            {searchQuery ? t('stores.noResults') : t('stores.noStoresFound')}
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery ? t('stores.tryDifferentSearch') : t('stores.noStoresSubtitle')}
                                        </p>
                                        {searchQuery && (
                                            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                                                <X className="h-4 w-4 mr-1" /> {t('stores.clearSearch')}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((store) => (
                                <TableRow key={store.id} className="hover:bg-muted/30">
                                    <TableCell className="text-muted-foreground text-sm">{store.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <StoreImage src={store.logo} alt={store.name} />
                                            <div>
                                                <p className="font-medium text-foreground">{store.name}</p>
                                                {store.address && (
                                                    <p className="text-xs text-muted-foreground truncate max-w-48">{store.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.storeType?.name_en ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.user?.name ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {store.phone ?? '—'}
                                    </TableCell>
                                    {/* Active */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleStatusMutation.mutate(store.id)}
                                            disabled={toggleStatusMutation.isPending}
                                            title={store.is_active ? t('stores.active') : t('stores.inactive')}
                                        >
                                            {store.is_active
                                                ? <ToggleRight className="h-5 w-5 text-emerald-500 mx-auto" />
                                                : <ToggleLeft className="h-5 w-5 text-muted-foreground mx-auto" />}
                                        </button>
                                    </TableCell>
                                    {/* Verified */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleVerifiedMutation.mutate(store.id)}
                                            disabled={toggleVerifiedMutation.isPending}
                                            title={store.is_verified ? t('stores.verified') : t('stores.unverified')}
                                        >
                                            {store.is_verified
                                                ? <ShieldCheck className="h-5 w-5 text-blue-500 mx-auto" />
                                                : <ShieldOff className="h-5 w-5 text-muted-foreground mx-auto" />}
                                        </button>
                                    </TableCell>
                                    {/* Featured */}
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => toggleFeaturedMutation.mutate(store.id)}
                                            disabled={toggleFeaturedMutation.isPending}
                                            title={store.is_featured ? t('stores.featured') : t('stores.unfeatured')}
                                        >
                                            <Star className={`h-5 w-5 mx-auto ${store.is_featured ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                onClick={() => openEdit(store)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => openDelete(store)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
  )
}
