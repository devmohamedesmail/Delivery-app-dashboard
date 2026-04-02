import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger ,DialogClose} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
export default function CreateDialog({isCreateOpen,setIsCreateOpen,createFormik,places,t,createMutation}:{
    isCreateOpen:boolean,
    setIsCreateOpen:React.Dispatch<React.SetStateAction<boolean>>,
    createFormik:any,
    places:any,
    t:any,
    createMutation:any
}) {
  return (
       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                {t("areas.addNewArea") || "Add New Area"}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{t("areas.addNewArea") || "Add New Area"}</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={createFormik.handleSubmit} className="space-y-4">
                                <div>
                                    <Label>{t("areas.name") || "Area Name"}</Label>
                                    <Input
                                        name="name"
                                        onChange={createFormik.handleChange}
                                        value={createFormik.values.name}
                                    />
                                    {createFormik.touched.name && createFormik.errors.name && (
                                        <p className="text-sm text-red-500">{createFormik.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("areas.areaCode") || "Area Code"}</Label>
                                    <Input
                                        name="area_code"
                                        onChange={createFormik.handleChange}
                                        value={createFormik.values.area_code}
                                    />
                                    {createFormik.touched.area_code && createFormik.errors.area_code && (
                                        <p className="text-sm text-red-500">{createFormik.errors.area_code}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("areas.description") || "Description"}</Label>
                                    <Input
                                        name="description"
                                        onChange={createFormik.handleChange}
                                        value={createFormik.values.description}
                                    />
                                    {createFormik.touched.description && createFormik.errors.description && (
                                        <p className="text-sm text-red-500">{createFormik.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("areas.price") || "Price"}</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        onChange={createFormik.handleChange}
                                        value={createFormik.values.price}
                                    />
                                    {createFormik.touched.price && createFormik.errors.price && (
                                        <p className="text-sm text-red-500">{createFormik.errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("areas.place") || "Place"}</Label>
                                    <Select
                                        value={createFormik.values.place_id}
                                        onValueChange={(value) => createFormik.setFieldValue('place_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("areas.selectPlace") || "Select a place"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {places?.map((place: any) => (
                                                <SelectItem key={place.id} value={place.id.toString()}>
                                                    {place.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createFormik.touched.place_id && createFormik.errors.place_id && (
                                        <p className="text-sm text-red-500">{createFormik.errors.place_id}</p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">
                                            {t("common.cancel")}
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? t("common.saving") : t("common.save")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
  )
}
