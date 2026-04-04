import React from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CategoriesSearch({ search, setSearch,setPage }: { search: string, setSearch: (search: string) => void,setPage: (page: number) => void }) {
    const { t } = useTranslation()
    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={t('categories.searchPlaceholder')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10 pr-10 shadow-sm"
            />
            {search && (
                <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
