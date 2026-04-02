import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AreaController from '@/controllers/areas-controller';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';



interface Area {
    id: number;
    name: string;
    area_code?: string;
    description?: string;
    price: number;
    place_id: number;
    createdAt?: string;
    updatedAt?: string;
    place?: {
        id: number;
        name: string;
        address: string;
    };
}
export default function useUpdateArea() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);



    const updateValidationSchema = Yup.object({
        name: Yup.string().required(t("areas.validation.nameRequired")),
        area_code: Yup.string(),
        description: Yup.string(),
        price: Yup.number().required(t("areas.validation.priceRequired")).min(0, t("areas.validation.priceMin")),
        place_id: Yup.number().required(t("areas.validation.placeRequired")),
    });



    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            AreaController.updateArea(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            editFormik.resetForm();
            setIsEditOpen(false);
            setEditingArea(null);
            toast.success(t('areas.updateSuccess') || "Area updated successfully!");
        },
        onError: (error: any) => {
            console.log("Update error:", error);
            toast.error(error?.response?.data?.message || "Failed to update area");
        },
    });


    const editFormik = useFormik({
        initialValues: {
            name: "",
            area_code: "",
            description: "",
            price: "",
            place_id: "",
        },
        validationSchema: updateValidationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!editingArea) return;
            updateMutation.mutate({
                id: editingArea.id,
                data: {
                    name: values.name,
                    area_code: values.area_code || undefined,
                    description: values.description || undefined,
                    price: Number(values.price),
                    place_id: Number(values.place_id),
                },
            });
        },
    });




     const handleEdit = (area: Area) => {
        setEditingArea(area);
        editFormik.setValues({
            name: area.name,
            area_code: area.area_code || "",
            description: area.description || "",
            price: area.price.toString(),
            place_id: area.place_id.toString(),
        });
        setIsEditOpen(true);
    };

    return {
        isEditOpen,
        setIsEditOpen,
        editingArea,
        setEditingArea,
        editFormik,
        updateMutation,
        updateValidationSchema,
        handleEdit
    }
}
