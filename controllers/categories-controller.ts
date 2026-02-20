import { config } from '@/constants/config';
import axios from 'axios';
import Cookies from 'js-cookie';

/* ========================= TYPES ========================= */

export interface Category {
    id: number;
    store_type_id: number;
    name: string;
    description?: string | null;
    image?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryData {
    store_type_id: number;
    name: string;
    description?: string;
    image?: File;
}

export interface UpdateCategoryData {
    store_type_id?: number;
    name?: string;
    description?: string;
    image?: File;
}

/* ========================= HELPERS ========================= */

function getAuthHeaders() {
    const token = Cookies.get('access_token');
    return { Authorization: `Bearer ${token}` };
}

function buildFormData(data: CreateCategoryData | UpdateCategoryData): FormData {
    const formData = new FormData();
    if (data.store_type_id) formData.append('store_type_id', String(data.store_type_id));
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    return formData;
}

/* ========================= CONTROLLER ========================= */

export default class CategoriesController {

    /** GET /categories */
    static async getAll(): Promise<Category[]> {
        const res = await axios.get(`${config.API_URL}/categories`);
        return res.data.data;
    }

    /** GET /categories/:id */
    static async getById(id: number): Promise<Category> {
        const res = await axios.get(`${config.API_URL}/categories/${id}`);
        return res.data.data;
    }

    /** POST /categories/create */
    static async create(data: CreateCategoryData): Promise<Category> {
        const formData = buildFormData(data);
        const res = await axios.post(
            `${config.API_URL}/categories/create`,
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

    /** PUT /categories/update/:id */
    static async update(id: number, data: UpdateCategoryData): Promise<Category> {
        const formData = buildFormData(data);
        const res = await axios.put(
            `${config.API_URL}/categories/update/${id}`,
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

    /** DELETE /categories/:id */
    static async destroy(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/categories/${id}`, {
            headers: getAuthHeaders(),
        });
    }

    /** GET /categories/store/:store_id */
    static async getByStore(store_id: number): Promise<Category[]> {
        const res = await axios.get(`${config.API_URL}/categories/store/${store_id}`);
        return res.data.data;
    }

    /** GET /categories/store-type/:store_type_id */
    static async getByStoreType(store_type_id: number): Promise<Category[]> {
        const res = await axios.get(`${config.API_URL}/categories/store-type/${store_type_id}`);
        return res.data.data;
    }
}
