import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge";
import { Place } from '@/controllers/places-controller';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button';
export default function UpdateDialog({isEditOpen, setIsEditOpen, editingArea, setEditingArea, updateMutation, editFormik, places, t}: {
    isEditOpen: boolean;
    setIsEditOpen: (open: boolean) => void;
    editingArea: any | null;
    setEditingArea: (area: any | null) => void;
    updateMutation: any;
    editFormik: any;
    places: any;
    t: any;
}) {
  return (
     <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t("areas.editArea") || "Edit Area"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={editFormik.handleSubmit} className="space-y-4">
                        <div>
                            <Label>{t("areas.name") || "Area Name"}</Label>
                            <Input
                                name="name"
                                onChange={editFormik.handleChange}
                                value={editFormik.values.name}
                            />
                            {editFormik.touched.name && editFormik.errors.name && (
                                <p className="text-sm text-red-500">{editFormik.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label>{t("areas.areaCode") || "Area Code"}</Label>
                            <Input
                                name="area_code"
                                onChange={editFormik.handleChange}
                                value={editFormik.values.area_code}
                            />
                            {editFormik.touched.area_code && editFormik.errors.area_code && (
                                <p className="text-sm text-red-500">{editFormik.errors.area_code}</p>
                            )}
                        </div>

                        <div>
                            <Label>{t("areas.description") || "Description"}</Label>
                            <Input
                                name="description"
                                onChange={editFormik.handleChange}
                                value={editFormik.values.description}
                            />
                            {editFormik.touched.description && editFormik.errors.description && (
                                <p className="text-sm text-red-500">{editFormik.errors.description}</p>
                            )}
                        </div>

                        <div>
                            <Label>{t("areas.price") || "Price"}</Label>
                            <Input
                                type="number"
                                step="0.01"
                                name="price"
                                onChange={editFormik.handleChange}
                                value={editFormik.values.price}
                            />
                            {editFormik.touched.price && editFormik.errors.price && (
                                <p className="text-sm text-red-500">{editFormik.errors.price}</p>
                            )}
                        </div>

                        <div>
                            <Label>{t("areas.place") || "Place"}</Label>
                            <Select
                                value={editFormik.values.place_id}
                                onValueChange={(value) => editFormik.setFieldValue('place_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("areas.selectPlace") || "Select a place"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {places?.map((place: Place) => (
                                        <SelectItem key={place.id} value={place.id.toString()}>
                                            {place.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editFormik.touched.place_id && editFormik.errors.place_id && (
                                <p className="text-sm text-red-500">{editFormik.errors.place_id}</p>
                            )}
                        </div>

                        <DialogFooter>
                            
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    {t("common.cancel")}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? t("common.updating") : t("common.update")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
  )
}
