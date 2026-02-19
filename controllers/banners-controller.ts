import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

/* ========================= TYPES ========================= */

export interface Banner {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    is_published: boolean;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBannerData {
    title: string;
    slug: string;
    content?: string;
    is_published?: boolean;
    image?: File;
}

export interface UpdateBannerData {
    title?: string;
    slug?: string;
    content?: string;
    is_published?: boolean;
    image?: File;
}

/* ========================= HELPERS ========================= */

function getAuthHeaders() {
    const token = Cookies.get('access_token');
    return { Authorization: `Bearer ${token}` };
}

function buildFormData(data: CreateBannerData | UpdateBannerData): FormData {
    const formData = new FormData();
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.slug !== undefined) formData.append('slug', data.slug);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.is_published !== undefined) formData.append('is_published', String(data.is_published));
    if (data.image) formData.append('image', data.image);
    return formData;
}

/* ========================= CONTROLLER ========================= */

export default class BannerController {

    /** GET all banners */
    static async getBanners(): Promise<Banner[]> {
        const res = await axios.get(`${config.API_URL}/banners`);
        return res.data.data;
    }

    /** GET single banner */
    static async getBannerById(id: number): Promise<Banner> {
        const res = await axios.get(`${config.API_URL}/banners/${id}`);
        return res.data.data;
    }

    /** CREATE banner */
    static async createBanner(data: CreateBannerData): Promise<Banner> {
        const formData = buildFormData(data);
        const res = await axios.post(
            `${config.API_URL}/banners/create`,
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

    /** UPDATE banner */
    static async updateBanner(id: number, data: UpdateBannerData): Promise<Banner> {
        const formData = buildFormData(data);
        const res = await axios.put(
            `${config.API_URL}/banners/update/${id}`,
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

    /** DELETE banner */
    static async deleteBanner(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/banners/${id}`, {
            headers: getAuthHeaders(),
        });
    }
}
