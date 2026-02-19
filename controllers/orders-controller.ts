import { config } from "@/constants/config";
import axios from "axios";
import Cookies from 'js-cookie';

/* ============================================================
   Types
   ============================================================ */

export type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';

export interface OrderUser {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
}

export interface OrderStore {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
}

export interface Order {
    id: number;
    user_id: number;
    store_id: number;
    order: any;          // JSON array of items
    total_price: number;
    delivery_address: string;
    phone: string;
    customer_name: string;
    status: OrderStatus;
    delivered_at: string | null;
    createdAt: string;
    updatedAt: string;
    user?: OrderUser;
    store?: OrderStore;
}

export interface OrdersResponse {
    orders: Order[];
    pagination: {
        current_page: number;
        per_page: number;
        total_orders: number;
        total_pages: number;
    };
}

export interface OrderStatistics {
    total_orders: number;
}

export interface GetOrdersParams {
    page?: number;
    limit?: number;
    status?: OrderStatus | '';
    user_id?: number;
    store_id?: number;
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
export default class OrdersController {
    /** GET /api/v1/orders */
    static async getOrders(params: GetOrdersParams = {}): Promise<OrdersResponse> {
        const response = await axios.get(`${config.API_URL}/orders`, {
            params,
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** GET /api/v1/orders/statistics */
    static async getStatistics(params: { store_id?: number; user_id?: number } = {}): Promise<OrderStatistics> {
        const response = await axios.get(`${config.API_URL}/orders/statistics`, {
            params,
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** GET /api/v1/orders/:id */
    static async getOrderById(id: number): Promise<Order> {
        const response = await axios.get(`${config.API_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    }

    /** PATCH /api/v1/orders/:id/status */
    static async updateStatus(id: number, status: OrderStatus): Promise<Order> {
        const response = await axios.patch(
            `${config.API_URL}/orders/${id}/status`,
            { status },
            { headers: getAuthHeaders() },
        );
        return response.data.data;
    }

    /** DELETE /api/v1/orders/:id */
    static async deleteOrder(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });
    }
}
