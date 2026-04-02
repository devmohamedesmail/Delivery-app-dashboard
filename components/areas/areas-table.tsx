'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
import type { Area } from '@/controllers/areas-controller';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
export default function AreasTable({areas, isLoading,handleEdit,handleDelete,page,setPage,searchTerm,deleteMutation}:{
    areas:any,
    isLoading:boolean,
    handleEdit:(area:Area)=>void,
    handleDelete:(id:number)=>void,
    page:number,
    setPage: React.Dispatch<React.SetStateAction<number>>
    searchTerm:string,
    setSearchTerm:(searchTerm:string)=>void,
    placeFilter:string,
    setPlaceFilter:(placeFilter:string)=>void
    deleteMutation:any
}) {
    const {t}=useTranslation()
  
  return (
    <div>
      {/* TABLE */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-center'>{t("common.id")}</TableHead>
                            <TableHead className='text-center'>{t("areas.name")}</TableHead>
                            <TableHead className='text-center'>{t("areas.areaCode")}</TableHead>
                            <TableHead className='text-center'>{t("areas.price")}</TableHead>
                            <TableHead className='text-center'>{t("areas.place")}</TableHead>
                            <TableHead className='text-center'>{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        ) : areas?.data && areas?.data?.length > 0 ? (
                            areas?.data?.map((area: Area) => (
                                <TableRow key={area.id}>
                                    <TableCell className='text-center'>{area.id}</TableCell>
                                    <TableCell className='text-center'>{area.name}</TableCell>
                                    <TableCell className='text-center'>{area.area_code || '-'}</TableCell>
                                    <TableCell className='text-center'>{area.price.toFixed(2)}</TableCell>
                                    <TableCell className='text-center'>
                                        {area.place ? (
                                            <Badge variant="secondary">{area.place.name}</Badge>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(area)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(area.id)}
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
                                <TableCell colSpan={6} className="text-center">
                                    {t("areas.noAreas") || "No areas found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            {areas?.meta && areas.meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {t("common.showing") || "Showing"} {((areas.meta.page - 1) * areas.meta.limit) + 1} {t("common.to") || "to"} {Math.min(areas.meta.page * areas.meta.limit, areas.meta.total)} {t("common.of") || "of"} {areas.meta.total} {t("common.entries") || "entries"}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={areas.meta.page <= 1}
                            onClick={() => setPage((p:any) => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            {t("common.previous") || "Previous"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={areas.meta.page >= areas.meta.totalPages}
                            onClick={() => setPage((p:any) => p + 1)}
                        >
                            {t("common.next") || "Next"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
</div>
  )
}
