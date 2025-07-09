'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PackageMinus, PackagePlus } from 'lucide-react';
import { useState } from 'react';
import StockInputForm from './stock-in';
import StockOutForm from './stock-out';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs:BreadcrumbItem[] = [
    {
        title:'ingredients',
        href: '/ingredients'
    },
    {
        title:'create stock',
        href:'/ingredients/stock/create'
    }
];
export default function StockNavigation({ units = [], ingredients = [] }) {
    const [activeForm, setActiveForm] = useState<'in' | 'out'>('in');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="p-2">
                <Card className="mx-auto max-w-md">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={activeForm === 'in' ? 'default' : 'outline'}
                                onClick={() => setActiveForm('in')}
                                className="flex items-center gap-2"
                            >
                                <PackagePlus className="h-4 w-4" />
                                Stock In
                            </Button>
                            <Button
                                variant={activeForm === 'out' ? 'default' : 'outline'}
                                onClick={() => setActiveForm('out')}
                                className="flex items-center gap-2"
                            >
                                <PackageMinus className="h-4 w-4" />
                                Stock Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Form Content */}
            <div className="pb-4">
                {activeForm === 'in' ? (
                    <StockInputForm units={units} ingredients={ingredients} />
                ) : (
                    <StockOutForm units={units} ingredients={ingredients} />
                )}
            </div>
        </div>
        </AppLayout>
    );
}
