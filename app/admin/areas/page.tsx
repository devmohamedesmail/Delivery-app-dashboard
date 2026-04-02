'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AreaController from '@/controllers/areas-controller';
import PlaceController from '@/controllers/places-controller';
import type { Area } from '@/controllers/areas-controller';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useAreas from '@/hooks/areas/useAreas';
import AreasTable from '@/components/areas/areas-table';
import UpdateDialog from '@/components/areas/update-dialog';
import CreateDialog from '@/components/areas/create-dialog';
import SearchSection from '@/components/areas/search-section';
import PlaceFilterSection from '@/components/areas/place-filter-section';
import AreasBadge from '@/components/areas/areas-badge';
import useCreateArea from '@/hooks/areas/useCreateArea';
import useUpdateArea from '@/hooks/areas/useUpdateArea';
import useDeleteArea from '@/hooks/areas/useDeleteArea';

export default function AreasPage() {
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation();
    // const [isCreateOpen, setIsCreateOpen] = useState(false);
    // const [isEditOpen, setIsEditOpen] = useState(false);
    // const [editingArea, setEditingArea] = useState<Area | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [placeFilter, setPlaceFilter] = useState<string>("all");
    const {
        isCreateOpen,
        setIsCreateOpen,
        createFormik,
        createMutation,
    } = useCreateArea()

    const {
        isEditOpen,
        setIsEditOpen,
        editingArea,
        setEditingArea,
        editFormik,
        updateMutation,
        handleEdit
    } = useUpdateArea()


    const { deleteMutation, handleDelete } = useDeleteArea()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [placeFilter]);


    // const { data: areas, isLoading } = useAreas()
    const { data: areas, isLoading } = useAreas(
  page,
  debouncedSearch,
  placeFilter
)
   
    // const filteredAreas = areas?.data?.filter((area: Area) => {
    //     const matchesSearch =
    //         area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         (area.area_code || "").toLowerCase().includes(searchTerm.toLowerCase());

    //     const matchesPlace =
    //         placeFilter === "all" || area.place_id.toString() === placeFilter;

    //     return matchesSearch && matchesPlace;
    // });

    /* ================= FETCH PLACES ================= */
    const { data: places } = useQuery({
        queryKey: ["places"],
        queryFn: PlaceController.getPlaces,
    });


    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <AreasBadge areas={areas} t={t} />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <PlaceFilterSection placeFilter={placeFilter} setPlaceFilter={setPlaceFilter} t={t} places={places} />
                    <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} t={t} />
                    <CreateDialog
                        isCreateOpen={isCreateOpen}
                        setIsCreateOpen={setIsCreateOpen}
                        createFormik={createFormik}
                        places={places}
                        t={t}
                        createMutation={createMutation}
                    />
                </div>
            </div>

            {/* EDIT DIALOG */}

            <UpdateDialog
                isEditOpen={isEditOpen}
                setIsEditOpen={setIsEditOpen}
                editingArea={editingArea}
                setEditingArea={setEditingArea}
                updateMutation={updateMutation}
                editFormik={editFormik}
                places={places}
                t={t}
            />

            <AreasTable
                // areas={{ ...areas, data: filteredAreas }}
                areas={areas}
                isLoading={isLoading}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                page={page}
                setPage={setPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeFilter={placeFilter}
                setPlaceFilter={setPlaceFilter}
                deleteMutation={deleteMutation}
            />

        </div>
    )
}
