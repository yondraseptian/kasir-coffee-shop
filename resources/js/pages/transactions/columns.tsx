'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Link, router } from '@inertiajs/react';

export type Transaction = {
    transaction_id: string;
    user_name: string;
    details: {
        product_name: string;
        quantity: number;
        price: number;
        total_price: number;
    }[];
};

const handleDelete = (transaction: Transaction) => {
    if (confirm(`Are you sure you want to delete transaction #${transaction.transaction_id}?`)) {
        router.delete(`/transactions/${transaction.transaction_id}`);
    }
};

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'transaction_id',
        header: 'ID',
    },
    {
        accessorKey: 'user_name',
        header: 'User',
    },
    {
        header: 'Total Items',
        cell: ({ row }) => {
            const totalItems = row.original.details.reduce((sum, item) => sum + item.quantity, 0);
            return <span>{totalItems}</span>;
        },
    },
    {
        header: 'Total Price',
        cell: ({ row }) => {
            const totalPrice = row.original.details.reduce((sum, item) => sum + item.total_price, 0);
            return <span>Rp {totalPrice.toLocaleString()}</span>;
        },
    },
    {
        header: 'Details',
        cell: ({ row }) => {
            const details = row.original.details;
            return (
                <ul className="text-sm space-y-1">
                    {details.map((item, index) => (
                        <li key={index}>
                            {item.product_name} - {item.quantity} x Rp{item.price.toLocaleString()} = Rp{item.total_price.toLocaleString()}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Link href={`/transactions/${row.original.transaction_id}`}>
                        <Button variant="outline" className="cursor-pointer">
                            View
                        </Button>
                    </Link>
                    <Button
                        onClick={() => handleDelete(row.original)}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
