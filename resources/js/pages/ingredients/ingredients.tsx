'use client';

import { AlertMessage } from '@/components/alert-message';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { columns, type Ingredient } from '@/pages/ingredients/columns';
import type { BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/inertia';
import { Head, router, usePage } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingredients',
        href: '/ingredients',
    },
];

export default function Stocks({ ingredients }: { ingredients: Ingredient[] }) {
    const [data, setData] = useState<Ingredient[]>(ingredients);
    const { flash } = usePage<PageProps>().props;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);

            // Sembunyikan alert otomatis setelah beberapa detik (opsional)
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        setData(ingredients);
    }, [ingredients]);

    const handleCreateIngredient = () => {
        router.visit('/ingredients/create');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredients" />

            <div className="space-y-6 p-4">
                {/* Header Section */}
                {showAlert && <AlertMessage variant="success" title="Success!" description={flash.success} />}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-muted-foreground" />
                            <h1 className="text-3xl font-bold tracking-tight">ingredients</h1>
                        </div>
                        <p className="text-muted-foreground">Manage your ingredient inventory and catalog</p>
                    </div>
                    <Button onClick={handleCreateIngredient} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create ingredient
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total ingredients</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.length}</div>
                            <p className="text-xs text-muted-foreground">Active ingredients in catalog</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.filter((ingredient) => ingredient.stock > 0).length}</div>
                            <p className="text-xs text-muted-foreground">ingredients available</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.filter((ingredient) => ingredient.stock === 0).length}</div>
                            <p className="text-xs text-muted-foreground">ingredients unavailable</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ingredients Catalog</CardTitle>
                        <CardDescription>View and manage all your ingredients in one place</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <DataTable columns={columns} data={data} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
