import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

interface Role {
    id: number;
    role: string;
    title_ar: string;
    title_en: string;
    createdAt: string;
    updatedAt: string;
}

interface Store {
    id: number;
    name: string;
    address: string | null;
    phone: string;
    logo: string | null;
    banner: string | null;
    start_time: string;
    end_time: string;
    devlivery_time: string | null;
    rating: number;
    is_active: boolean;
    is_verified: boolean;
    is_featured: boolean;
    user_id: number;
    store_type_id: number;
    createdAt: string;
    updatedAt: string;
    place_id: number;
}

interface User {
    id: number;
    email: string | null;
    phone: string | null;
    password: string;
    name: string;
    avatar: string | null;
    provider_id: string;
    provider_name: string;
    email_verified: boolean;
    phone_verified: boolean;
    role_id: number;
    createdAt: string;
    updatedAt: string;
    role: Role;
    store: Store | null;
}

interface UsersResponse {
    success: boolean;
    count: number;
    data: User[];
}

export default class UsersController {
    /**
     * Get all users
     * @returns Promise<User[]>
     */
    static async getUsers(): Promise<User[]> {
        const token = Cookies.get('access_token');
        const res = await axios.get<UsersResponse>(`${config.API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.data;
    }
}

export type { User, Role, Store, UsersResponse };
