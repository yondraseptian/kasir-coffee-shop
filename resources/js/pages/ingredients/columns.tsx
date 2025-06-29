'use client';

import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ingredient = {
    stock: number;
    id: string;
    name: string;
    quantity: number;
    unit_id: number;
    unit: string;
};

const handleDelete = (Ingredients: Ingredient) => {
    if (confirm('Are you sure you want to delete this product?')) {
        router.delete(`/ingredients/${Ingredients.id}`);
    }                                                                       
};

export const columns: ColumnDef<Ingredient>[] = [
    {
        accessorKey: 'name',
        header: 'name',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Link href={`/ingredients/${row.original.id}/edit`}>
                    <Button variant="outline" className="cursor-pointer">
                        Edit
                    </Button>
                    </Link>
                    <Button onClick={() => handleDelete(row.original)} variant="destructive" className="cursor-pointer">
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
