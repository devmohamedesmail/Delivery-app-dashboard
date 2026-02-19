import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

/* ============================================================
   Types
   ============================================================ */
export interface Role {
    id: number;
    role: string;
    title_en: string | null;
    title_ar: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RoleStatItem {
    id: number;
    name: string;
    userCount: number;
    createdAt: string;
}

export interface RoleStatistics {
    totalRoles: number;
    roles: RoleStatItem[];
}

export interface RoleUser {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
}

export interface RoleUsersResponse {
    role: string;
    users: RoleUser[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        usersPerPage: number;
    };
}

export interface CreateRoleData {
    role: string;
    title_en?: string;
    title_ar?: string;
}

export interface UpdateRoleData {
    role: string;
    title_en?: string;
    title_ar?: string;
}

/* ============================================================
   Helper
   ============================================================ */
const getAuthHeaders = () => {
    const token = Cookies.get('access_token');
    return { Authorization: `Bearer ${token}` };
};

/* ============================================================
   Controller
   ============================================================ */
export default class RolesController {
    /** GET /api/v1/roles — fetch all roles */
    static async getRoles(): Promise<Role[]> {
        const response = await axios.get(`${config.API_URL}/roles`);
        return response.data.data;
    }

    /** GET /api/v1/roles/statistics — fetch statistics */
    static async getStatistics(): Promise<RoleStatistics> {
        const response = await axios.get(`${config.API_URL}/roles/statistics`, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** GET /api/v1/roles/:id — fetch single role */
    static async getRoleById(id: number): Promise<Role> {
        const response = await axios.get(`${config.API_URL}/roles/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** GET /api/v1/roles/:id/users — fetch users for a role */
    static async getUsersByRole(id: number, page = 1, limit = 10): Promise<RoleUsersResponse> {
        const response = await axios.get(`${config.API_URL}/roles/${id}/users`, {
            params: { page, limit },
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** POST /api/v1/roles/create — create role */
    static async createRole(data: CreateRoleData): Promise<Role> {
        const response = await axios.post(`${config.API_URL}/roles/create`, data, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** PUT /api/v1/roles/:id — update role */
    static async updateRole(id: number, data: UpdateRoleData): Promise<Role> {
        const response = await axios.put(`${config.API_URL}/roles/${id}`, data, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** DELETE /api/v1/roles/:id — delete role */
    static async deleteRole(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/roles/${id}`, {
            headers: getAuthHeaders(),
        });
    }
}
