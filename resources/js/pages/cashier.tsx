'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Product {
    id: string;
    name: string;
    price: number;
    category_name: string;
    stock: number;
    lowStockThreshold: number;
    image: string;
}

interface CartItem extends Product {
    quantity: number;
}

export default function CashierPage({ products: initialProducts }: { products: Product[] }) {
    const [products] = useState<Product[]>(initialProducts);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Menentukan kategori produk untuk filter
    const categories = ['All', ...Array.from(new Set(products.map((p) => p.category_name)))];
    const filteredProducts = selectedCategory === 'All' ? products : products.filter((p) => p.category_name === selectedCategory);

    // Menambahkan produk ke dalam keranjang
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;

        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Menghitung total harga dalam keranjang
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Memproses pesanan, mengurangi stok produk dan menghapus keranjang

    const processOrder = () => {
        if (cart.length === 0) return;

        const payload = {
            products: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total: getTotalPrice(),
        };

        router.post('/transactions', payload, {
            onSuccess: () => {
                setCart([]);
                alert('Order processed successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Failed to process order');
            },
        });
    };

    // Fungsi untuk memperbarui kuantitas produk di keranjang
    const updateCartQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            // Jika kuantitas <= 0, hapus item dari keranjang
            setCart((prev) => prev.filter((item) => item.id !== id));
        } else {
            // Jika kuantitas lebih besar dari 0, perbarui kuantitas produk
            setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Cashier', href: '/cashier' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cashier" />
            <div className="min-h-screen">
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${product.stock <= 0 ? 'opacity-50' : ''}`}
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardContent className="p-4">
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="mb-2 h-20 w-full rounded object-cover"
                                            />
                                            <h3 className="mb-1 text-sm font-medium">{product.name}</h3>
                                            <p className="text-lg font-bold text-green-600">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(product.price)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Current Order
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cart.length === 0 ? (
                                        <p className="py-8 text-center text-muted-foreground">No items in cart</p>
                                    ) : (
                                        <>
                                            <div className="max-h-64 space-y-2 overflow-y-auto">
                                                {cart.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between rounded border p-2">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-lg font-bold text-green-600">
                                                                {new Intl.NumberFormat('id-ID', {
                                                                    style: 'currency',
                                                                    currency: 'IDR',
                                                                }).format(item.price)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateCartQuantity(item.id, item.quantity - 1);
                                                                }}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateCartQuantity(item.id, item.quantity + 1);
                                                                }}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-4 border-t pt-4">
                                                <div className="flex items-center justify-between text-lg font-bold">
                                                    <span>Total:</span>
                                                    <span>
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        }).format(getTotalPrice())}
                                                    </span>
                                                </div>
                                                <Button className="w-full" size="lg" onClick={processOrder}>
                                                    Process Order
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
