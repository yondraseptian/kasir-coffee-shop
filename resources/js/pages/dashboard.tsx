/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import type { BreadcrumbItem, DashboardProps } from '@/types';
import { PageProps } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, DollarSign, Info, Package, Plus, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const {
        cogs,
        stockUsage,
        spoilage,
        sales,
        totalProducts,
        stockValue,
        spoilRate,
        efficiency,
        stockUsageDetails,
        stockValueDetails,
        ingredientStockAlerts,
    } = usePage<PageProps & DashboardProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* COGS Summary Card */}
                <div className="mb-6 rounded-lg bg-gradient-to-r from-stone-200 to-stone-100 p-6">
                    <div className="flex items-center justify-between">
                        {/* Left side - COGS Estimation */}
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-600">COGS Estimation</div>
                                <div className="text-2xl font-bold text-gray-800">{cogs}%</div>
                                <div className="flex items-center text-xs text-gray-500">
                                    This month
                                    <Info className="ml-1 h-3 w-3" />
                                </div>
                            </div>
                        </div>

                        {/* Right side - Metrics */}
                        <div className="flex items-center space-x-8">
                            {/* Stock Usage */}
                            <div className="text-center">
                                <div className="mb-1 text-sm font-medium text-gray-600">Stock Usage</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                        <Package className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">{formatRupiah(stockUsage)}</div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 rounded-full bg-gray-300 p-0 hover:bg-gray-400"
                                        onClick={() => {
                                            // Add your stock usage action here
                                            console.log('Stock usage clicked');
                                        }}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Spoil */}
                            <div className="text-center">
                                <div className="mb-1 flex items-center text-sm font-medium text-gray-600">
                                    Spoil
                                    <span className="ml-1 text-xs text-gray-400">This month</span>
                                    <Info className="ml-1 h-3 w-3 text-gray-400" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400">
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">{formatRupiah(spoilage)}</div>
                                </div>
                            </div>

                            {/* Sales */}
                            <div className="text-center">
                                <div className="mb-1 text-sm font-medium text-gray-600">Sales</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                                        <BarChart3 className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">{formatRupiah(sales)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Dashboard Content */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Quick Stats Cards */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            <span className="text-green-600">+12%</span> from last month
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Stock Value</p>
                                <p className="text-2xl font-bold text-gray-900">{formatRupiah(stockValue)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            <span className="text-green-600">+8.3%</span> from last month
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Spoilage Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{spoilRate}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            <span className="text-red-600">-0.5%</span> improvement
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                                <p className="text-2xl font-bold text-gray-900">{efficiency}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-purple-500" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            <span className="text-green-600">+2.1%</span> from target
                        </p>
                    </div>
                </div>

                {/* Recent Activity or Trending Products */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Stock replenished for Product A</span>
                            </div>
                            <span className="text-xs text-gray-400">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                <span className="text-sm text-gray-600">High spoilage detected in Category B</span>
                            </div>
                            <span className="text-xs text-gray-400">4 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">New sales record achieved</span>
                            </div>
                            <span className="text-xs text-gray-400">6 hours ago</span>
                        </div>
                    </div>
                </div>
            

                <div>
                    <h2 className="mt-8 mb-4 text-xl font-bold">Stock Usage Details</h2>
                    <table className="w-full table-auto border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2 text-left">Ingredient</th>
                                <th className="border px-4 py-2 text-right">Used Quantity</th>
                                <th className="border px-4 py-2 text-right">Price per Unit</th>
                                <th className="border px-4 py-2 text-right">Total Usage Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockUsageDetails.map((usage: any, index: number) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{usage.ingredient_name}</td>
                                    <td className="border px-4 py-2 text-right">{usage.used_quantity}</td>
                                    <td className="border px-4 py-2 text-right">Rp {Number(usage.price_per_unit).toLocaleString()}</td>
                                    <td className="border px-4 py-2 text-right font-semibold text-red-600">
                                        Rp {Number(usage.total_usage_cost).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2 className="mt-10 mb-4 text-xl font-bold">Stock Value Details (Purchased)</h2>
                    <table className="w-full table-auto border-collapse border text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-3 py-2 text-left">Date</th>
                                <th className="border px-3 py-2 text-left">Ingredient</th>
                                <th className="border px-3 py-2 text-right">Quantity Bought</th>
                                <th className="border px-3 py-2 text-right">Price/Unit</th>
                                <th className="border px-3 py-2 text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockValueDetails.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="border px-3 py-2">{item.date}</td>       
                                    <td className="border px-3 py-2">{item.ingredient_name}</td>
                                    <td className="border px-3 py-2 text-right">{item.quantity}</td>
                                    <td className="border px-3 py-2 text-right">Rp {Number(item.price_per_unit).toLocaleString()}</td>
                                    <td className="border px-3 py-2 text-right font-semibold text-blue-700">
                                        Rp {Number(item.total_value).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-10">
                    <h2 className="mb-2 text-lg font-bold">Ingredient Stock Alerts</h2>
                    <table className="w-full table-auto border-collapse border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">Ingredient</th>
                                <th className="border px-3 py-2 text-right">Stock In</th>
                                <th className="border px-3 py-2 text-right">Final Stock</th>
                                <th className="border px-3 py-2 text-right">Alert Threshold</th>
                                <th className="border px-3 py-2 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredientStockAlerts.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="border px-3 py-2">{item.name}</td>
                                    <td className="border px-3 py-2 text-right">{item.stock_in}</td>
                                    <td className="border px-3 py-2 text-right">{item.final_stock}</td>
                                    <td className="border px-3 py-2 text-right">{item.stock_alert_threshold}</td>
                                    <td
                                        className={`border px-3 py-2 text-center font-semibold ${
                                            item.is_below_threshold ? 'text-red-600' : 'text-green-600'
                                        }`}
                                    >
                                        {item.is_below_threshold ? 'Low Stock' : 'OK'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
