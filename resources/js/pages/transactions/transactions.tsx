'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/inertia';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { columns,  Transaction} from './columns';
import { AlertMessage } from '@/components/alert-message';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

export default function Transactions({ transactions }: { transactions: Transaction[] }) {
    const [data, setData] = useState<Transaction[]>(transactions);
    const [showAlert, setShowAlert] = useState(false);
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);

            // Sembunyikan alert otomatis setelah beberapa detik (opsional)
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        setData(transactions);
    }, [transactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-6 p-4">
                {/* Header Section */}
                {showAlert && <AlertMessage variant="success" title="Success!" description={flash.success ?? ''} />}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-muted-foreground" />
                            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                        </div>
                        <p className="text-muted-foreground">Manage your transactions</p>
                    </div>
                    <Link href="/products/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Product
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
              <p className="text-xs text-muted-foreground">Active products in catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter((product) => product.stock > 0).length}</div>
              <p className="text-xs text-muted-foreground">Products available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter((product) => product.stock === 0).length}</div>
              <p className="text-xs text-muted-foreground">Products unavailable</p>
            </CardContent>
          </Card>
        </div> */}

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction List</CardTitle>
                        <CardDescription>View and manage all your transactions in one place</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <DataTable columns={columns} data={data} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
