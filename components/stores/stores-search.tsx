import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../ui/input'
import { useTranslation } from 'react-i18next'

export default function StoresSearch({
    searchQuery,
    setSearchQuery
}: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}) {
    const { t } = useTranslation();
    return (
         <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9 pr-9"
                    placeholder={t('stores.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchQuery('')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
    )
}
