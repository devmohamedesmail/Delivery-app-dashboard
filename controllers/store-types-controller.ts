import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

/* ========================= TYPES ========================= */

export interface StoreType {
    id: number;
    name_en: string;
    name_ar: string;
    description?: string | null;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStoreTypeData {
    name_en: string;
    name_ar: string;
    description?: string;
    image?: File;
}

export interface UpdateStoreTypeData {
    name_en?: string;
    name_ar?: string;
    description?: string;
    image?: File;
}

/* ========================= HELPERS ========================= */

function getAuthHeaders() {
    const token = Cookies.get('access_token');
    return { Authorization: `Bearer ${token}` };
}

function buildFormData(data: CreateStoreTypeData | UpdateStoreTypeData): FormData {
    const formData = new FormData();
    if (data.name_en) formData.append('name_en', data.name_en);
    if (data.name_ar) formData.append('name_ar', data.name_ar);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    return formData;
}

/* ========================= CONTROLLER ========================= */

export default class StoreTypeController {

    /**
     * GET all store types
     */
    static async getStoreTypes(): Promise<StoreType[]> {
        const res = await axios.get(`${config.API_URL}/store-types`);
        return res.data.data;
    }

    /**
     * GET single store type by ID
     */
    static async getStoreTypeById(id: number): Promise<StoreType> {
        const res = await axios.get(`${config.API_URL}/store-types/${id}`);
        return res.data.data;
    }

    /**
     * CREATE store type (multipart/form-data because of image)
     */
    static async createStoreType(data: CreateStoreTypeData): Promise<StoreType> {
        const formData = buildFormData(data);
        const res = await axios.post(
            `${config.API_URL}/store-types/create`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data.data;
    }

    /**
     * UPDATE store type (multipart/form-data because of image)
     */
    static async updateStoreType(id: number, data: UpdateStoreTypeData): Promise<StoreType> {
        const formData = buildFormData(data);
        const res = await axios.put(
            `${config.API_URL}/store-types/update/${id}`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data.data;
    }

    /**
     * DELETE store type
     */
    static async deleteStoreType(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/store-types/${id}`, {
            headers: getAuthHeaders(),
        });
    }
}
