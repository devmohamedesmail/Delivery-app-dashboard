import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AreaController from '@/controllers/areas-controller'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function useCreateArea() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const queryClient = useQueryClient();
    const { t } = useTranslation();


    const createValidationSchema = Yup.object({
        name: Yup.string().required(t("areas.validation.nameRequired")),
        area_code: Yup.string(),
        description: Yup.string(),
        price: Yup.number().required(t("areas.validation.priceRequired")).min(0, t("areas.validation.priceMin")),
        place_id: Yup.number().required(t("areas.validation.placeRequired")),
    });
    const createMutation = useMutation({
        mutationFn: AreaController.createArea,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            createFormik.resetForm();
            setIsCreateOpen(false);
            toast.success(t('areas.createSuccess') || "Area created successfully!");
        },
        onError: (error: any) => {
            console.log("Create error:", error);
            toast.error(error?.response?.data?.message || "Failed to create area");
        },
    });


    const createFormik = useFormik({
        initialValues: {
            name: "",
            area_code: "",
            description: "",
            price: "",
            place_id: "",
        },
        validationSchema: createValidationSchema,
        onSubmit: (values) => {
            createMutation.mutate({
                name: values.name,
                area_code: values.area_code || undefined,
                description: values.description || undefined,
                price: Number(values.price),
                place_id: Number(values.place_id),
            });
        },
    });
    return {
        isCreateOpen,
        setIsCreateOpen,
        createFormik,
        createMutation,
        createValidationSchema,
        queryClient,
        t,
    }
}
