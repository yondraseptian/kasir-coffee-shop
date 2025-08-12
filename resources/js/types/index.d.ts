/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
interface StockUsageDetail {
    ingredient_name: string;
    used_quantity: number;
    price_per_unit: number;
    total_usage_cost: number;
}
export interface DashboardProps {
    cogs: number;
    stockUsage: number;
    spoilage: number;
    sales: number;
    totalProducts: number;
    stockValue: number;
    spoilRate: number;
    efficiency: number;
    stockUsageDetails: StockUsageDetail[]; 
    stockValueDetails: any[];
    ingredientStockAlerts: any[]; 
}

export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

interface ReceiptProps {
    transaction: {
        billNum: string;
        queueNum?: string;
        cashier: string;
        member: string;
        salesMode: string;
        createdAt: string;
        items: {
            name: string;
            variant?: string;
            price: number;
            quantity: number;
            subtotal: number;
        }[];
        total: number;
    };
}
