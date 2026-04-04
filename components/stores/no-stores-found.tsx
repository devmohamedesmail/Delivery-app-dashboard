import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Store, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
export default function NoStoresFound({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) {
    const { t } = useTranslation()
    return (
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
    )
}
