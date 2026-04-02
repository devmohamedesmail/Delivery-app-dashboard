import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export default function PlaceFilterSection({ placeFilter, setPlaceFilter, t, places }: {
    placeFilter: string,
    setPlaceFilter: React.Dispatch<React.SetStateAction<string>>,
    t: any,
    places: any
}) {
    return (
        <Select value={placeFilter} onValueChange={setPlaceFilter}>
            <SelectTrigger className="w-45">
                <SelectValue placeholder={t("areas.filterByPlace")} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {places?.map((place: any) => (
                    <SelectItem key={place.id} value={place.id.toString()}>
                        {place.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
