
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ToggleLeft, ToggleRight, ShieldCheck, ShieldOff, X, Star } from 'lucide-react'
import StoreImage from './store-image'
import NoStoresFound from './no-stores-found'
import StoresLoading from './stores-loading'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StoresTable({ isLoading, filtered, searchQuery, setSearchQuery, toggleStatusMutation, toggleVerifiedMutation, toggleFeaturedMutation, openEdit, openDelete }: { isLoading: boolean, filtered: any[], searchQuery: string, setSearchQuery: (query: string) => void, toggleStatusMutation: any, toggleVerifiedMutation: any, toggleFeaturedMutation: any, openEdit: (store: any) => void, openDelete: (store: any) => void }) {
    const { t } = useTranslation()
    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-12 text-start">ID</TableHead>
                        <TableHead className='text-start'>{t('stores.store')}</TableHead>
                        <TableHead className='text-start'>{t('stores.storeType')}</TableHead>
                        <TableHead className='text-start'>{t('stores.owner')}</TableHead>
                        <TableHead className='text-start'>{t('stores.phone')}</TableHead>
                        <TableHead className="text-start">{t('stores.isActive')}</TableHead>
                        <TableHead className="text-start">{t('stores.isVerified')}</TableHead>
                        <TableHead className="text-start">{t('stores.isFeatured')}</TableHead>
                        <TableHead className="text-right">{t('stores.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <StoresLoading />
                    ) : filtered.length === 0 ? (
                        <NoStoresFound searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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







                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className='w-20 focus:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 focus:text-primary-foreground'>{t('stores.actions')}</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>

                                                <DropdownMenuItem onClick={() => toggleStatusMutation.mutate(store.id)}>{store.is_active ? t('stores.inactive') : t('stores.active')}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleVerifiedMutation.mutate(store.id)}>{store.is_verified ? t('stores.unverified') : t('stores.verified')}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleFeaturedMutation.mutate(store.id)}>{store.is_featured ? t('stores.unfeatured') : t('stores.featured')}</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => openEdit(store)}>{t('stores.edit')}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openDelete(store)}>{t('stores.delete')}</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>











                                    {/* <div className="flex items-center justify-end gap-2">
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
                                    </div> */}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
