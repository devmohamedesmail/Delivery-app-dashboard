import React from 'react'
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
export default function BannerSearch({searchQuery, setSearchQuery}: {searchQuery: string, setSearchQuery: (query: string) => void}) {
    const { t } = useTranslation();
  return (
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
  )
}
