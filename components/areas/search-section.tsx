import React from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react";
export default function SearchSection({ searchTerm, setSearchTerm, t }: {
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    t: any
}) {
    return (
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />

            <Input
                placeholder={t("common.search")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}
