import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

/* ========================= TYPES ========================= */

export interface StoreType {
    id: number;
    name_en: string;
    name_ar: string;
}

export interface StoreUser {
    id: number;
    name: string;
    email: string;
}

export interface Store {
    id: number;
    name: string;
    logo?: string | null;
    banner?: string | null;
    address?: string | null;
    phone?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    is_active: boolean;
    is_verified: boolean;
    is_featured: boolean;
    rating?: number | null;
    store_type_id: number;
    place_id?: number | null;
    user_id: number;
    storeType?: StoreType | null;
    user?: StoreUser | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStoreData {
    name: string;
    address?: string;
    phone?: string;
    start_time?: string;
    end_time?: string;
    store_type_id: number;
    place_id?: number;
    logo?: File;
    banner?: File;
}

export interface UpdateStoreData {
    name?: string;
    address?: string;
    phone?: string;
    start_time?: string;
    end_time?: string;
    store_type_id?: number;
    logo?: File;
    banner?: File;
}

/* ========================= HELPERS ========================= */

function getAuthHeaders() {
    const token = Cookies.get('access_token');
    return { Authorization: `Bearer ${token}` };
}

function buildFormData(data: CreateStoreData | UpdateStoreData): FormData {
    const fd = new FormData();
    if (data.name !== undefined) fd.append('name', data.name);
    if (data.address !== undefined) fd.append('address', data.address);
    if (data.phone !== undefined) fd.append('phone', data.phone);
    if (data.start_time !== undefined) fd.append('start_time', data.start_time);
    if (data.end_time !== undefined) fd.append('end_time', data.end_time);
    if ((data as CreateStoreData).store_type_id !== undefined)
        fd.append('store_type_id', String((data as CreateStoreData).store_type_id));
    if ((data as CreateStoreData).place_id !== undefined)
        fd.append('place_id', String((data as CreateStoreData).place_id));
    if (data.logo) fd.append('logo', data.logo);
    if (data.banner) fd.append('banner', data.banner);
    return fd;
}

/* ========================= CONTROLLER ========================= */

export default class StoreController {

    /** GET all stores */
    static async getStores(): Promise<Store[]> {
        const res = await axios.get(`${config.API_URL}/stores`);
        return res.data.data;
    }

    /** GET single store */
    static async getStoreById(id: number): Promise<Store> {
        const res = await axios.get(`${config.API_URL}/stores/show/${id}`);
        return res.data.data;
    }

    /** CREATE store */
    static async createStore(data: CreateStoreData): Promise<Store> {
        const fd = buildFormData(data);
        const res = await axios.post(`${config.API_URL}/stores/create`, fd, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    }

    /** UPDATE store */
    static async updateStore(id: number, data: UpdateStoreData): Promise<Store> {
        const fd = buildFormData(data);
        const res = await axios.put(`${config.API_URL}/stores/update/${id}`, fd, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    }

    /** DELETE store */
    static async deleteStore(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/stores/delete/${id}`, {
            headers: getAuthHeaders(),
        });
    }

    /** TOGGLE active status */
    static async toggleStatus(id: number): Promise<{ is_active: boolean }> {
        const res = await axios.patch(`${config.API_URL}/stores/toggle-status/${id}`, {}, {
            headers: getAuthHeaders(),
        });
        return res.data.data;
    }

    /** TOGGLE verified status */
    static async verifyStore(id: number): Promise<{ is_verified: boolean }> {
        const res = await axios.patch(`${config.API_URL}/stores/${id}/verify`, {}, {
            headers: getAuthHeaders(),
        });
        return res.data.data;
    }

    /** TOGGLE featured status */
    static async toggleFeatured(id: number): Promise<{ is_featured: boolean }> {
        const res = await axios.patch(`${config.API_URL}/stores/${id}/featured`, {}, {
            headers: getAuthHeaders(),
        });
        return res.data.data;
    }
}
