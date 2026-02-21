import { config } from "@/constants/config";
import axios from "axios";
import Cookies from "js-cookie";

/* ============================================================
   Types
   ============================================================ */

export interface Notification {
    id: number;
    title: string;
    message: string;
    data?: any;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    success: boolean;
    data: Notification[];
}

export interface CreateNotificationPayload {
    title: string;
    message: string;
    data?: any;
}

/* ============================================================
   Helper
   ============================================================ */
const getAuthHeaders = () => {
    const token = Cookies.get("access_token");
    return { Authorization: `Bearer ${token}` };
};

/* ============================================================
   Controller
   ============================================================ */
export default class NotificationsController {
    /** GET /api/v1/notifications?target_type=all */
    static async getNotifications(
        target_type: string = "all",
        target_id?: number
    ): Promise<Notification[]> {
        const params: Record<string, any> = { target_type };
        if (target_id !== undefined) params.target_id = target_id;

        const response = await axios.get(`${config.API_URL}/notifications`, {
            params,
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** GET /api/v1/notifications/unread?target_type=all&user_id=X */
    static async getUnreadNotifications(
        target_type: string = "all",
        target_id?: number,
        user_id?: number
    ): Promise<Notification[]> {
        const params: Record<string, any> = { target_type };
        if (target_id !== undefined) params.target_id = target_id;
        if (user_id !== undefined) params.user_id = user_id;

        const response = await axios.get(
            `${config.API_URL}/notifications/unread`,
            { params, headers: getAuthHeaders() }
        );
        return response.data.data;
    }

    /** PUT /api/v1/notifications/read/:id */
    static async markAsRead(id: number, user_id: number): Promise<void> {
        await axios.put(
            `${config.API_URL}/notifications/read/${id}`,
            { user_id },
            { headers: getAuthHeaders() }
        );
    }

    /** DELETE /api/v1/notifications/:id */
    static async deleteNotification(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/notifications/${id}`, {
            headers: getAuthHeaders(),
        });
    }

    /** POST /api/v1/notifications/all */
    static async createForAll(
        payload: CreateNotificationPayload
    ): Promise<Notification> {
        const response = await axios.post(
            `${config.API_URL}/notifications/all`,
            payload,
            { headers: getAuthHeaders() }
        );
        return response.data.data;
    }
}
