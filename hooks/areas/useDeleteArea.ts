import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AreaController from "@/controllers/areas-controller";
import { useTranslation } from "react-i18next";

export default function useDeleteArea() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const deleteMutation = useMutation({
        mutationFn: AreaController.deleteArea,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            toast.success(t('areas.deleteSuccess') || "Area deleted successfully!");
        },
        onError: (error: any) => {
            console.log("Delete error:", error);
            toast.error(error?.response?.data?.message || "Failed to delete area");
        },
    });

     const handleDelete = (id: number) => {
        if (confirm(t('common.confirm_delete') || 'Are you sure you want to delete this area?')) {
            deleteMutation.mutate(id);
        }
    };

    return {
        deleteMutation,
        handleDelete,
    };
}