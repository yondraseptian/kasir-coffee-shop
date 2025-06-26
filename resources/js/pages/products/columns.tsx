'use client';

import { Button } from '@/components/ui/button';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export type Product = {
    id: string;
    name: string;
    category_name: string;
    price: number;
    ingredients: {
        name: string;
        quantity: number;
        unit: string; // Nama unit, bukan unit_id
    }[];
};



const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        Inertia.delete(route('products.destroy', product.id), {
            onSuccess: () => {
                alert('Product deleted successfully');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Failed to delete the product.');
            },
        });
    }
};

export const columns: ColumnDef<Product>[] = [
    
    {
        accessorKey: 'name',
        header: 'name',
    },
    {
        accessorKey: 'category_name',
        header: 'Category',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'ingredients',
        header: 'Ingredients',
        cell: ({ row }) => {
            const ingredients = row.original.ingredients;
            return (
                <div>
                    {ingredients.length > 0 ? (
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span>No ingredients</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Link href={`/products/${row.original.id}/edit`}>
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
