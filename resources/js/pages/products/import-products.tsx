'use client';

import ExcelUploader from '@/components/excel-uploader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TemplateConfig, UploadedRow } from '@/types/excel-uploader';
import { Head, router, usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState } from 'react';

export const productTemplate: TemplateConfig = {
    name: 'Product Import Template',
    description: 'Use this template to import product data including Product Code, name, pricing',
    columns: [
        {
            name: 'Product Code',
            key: 'product_code',
            type: 'text',
            required: true,
            example: 'PROD-001',
            validation: (value: string) => {
                if (!value || value.length < 3) return 'Product Code must be at least 3 characters';
                return null;
            },
        },
        {
            name: 'Product Name',
            key: 'name',
            type: 'text',
            required: true,
            example: 'Produk A',
        },
        {
            name: 'Category',
            key: 'category_name',
            type: 'select',
            required: true,
            example: 'Coffee',
            options: ['Coffee', 'Tea', 'Lainnya'], // Sesuaikan dengan data di tabel `categories`
        },
        {
            name: 'Price',
            key: 'price',
            type: 'number',
            required: true,
            example: '10000',
            validation: (value: string) => {
                const num = Number.parseFloat(value);
                if (isNaN(num) || num <= 0) return 'Price must be a positive number';
                return null;
            },
        },
        {
            name: 'Image Filename',
            key: 'image',
            type: 'text',
            required: false,
            example: 'product-a.jpg',
        },
        {
            name: 'Ingredients',
            key: 'ingredients',
            type: 'text',
            required: true,
            example: 'Coffee Beans:2:gram,Sugar:1.5:gram',
            helperText: 'Format: ingredient_name:quantity:unit_name, pisahkan dengan koma untuk beberapa bahan',
        },
    ],
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Import',
        href: '/products/import',
    },
];

export default function ImportProducts() {
    const [importedProducts, setImportedProducts] = useState<UploadedRow[]>([]);
    const {errors} = usePage().props;

    const mapImportedRow = (row: any) => {
        return {
            product_code: row['Product Code'],
            name: row['Product Name'],
            category_name: row['Category'],
            price: row['Price'],
            image: row['Image Filename'],
            ingredients: row['Ingredients'],
        };
    };

    const handleProductImport = (data: UploadedRow[]) => {
        const cleanedData = data.filter((row) => row._validation?.status === 'valid').map(mapImportedRow);

        router.post(
            '/products/import',
            {
                products: cleanedData,
            },
            {
                onSuccess: () => {
                    console.log('Import sukses');
                },
                onError: (errors) => {
                    console.error(errors);
                },
            },
        );

        console.log(cleanedData);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import" />
            <div className="space-y-6">
                {importedProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Import Successful
                            </CardTitle>
                            <CardDescription>Successfully imported {importedProducts.length} products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {importedProducts.slice(0, 5).map((product, index) => (
                                    <Badge key={index} variant="secondary">
                                        {product['Product Name']}
                                    </Badge>
                                ))}
                                {importedProducts.length > 5 && <Badge variant="outline">+{importedProducts.length - 5} more</Badge>}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <ExcelUploader template={productTemplate} onDataImport={handleProductImport} />
            </div>
        </AppLayout>
    );
}
