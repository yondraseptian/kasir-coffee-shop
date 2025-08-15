/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import type { AvailableCategory, AvailableIngredient, AvailableUnit } from '@/types/product';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface IngredientEntry {
    id: string;
    ingredient: string;
    quantity: string;
    unit: string;
}

interface ProductVariant {
    id: string;
    size: string;
    temperature: string;
    price: string;
}

const sizes = ['Small', 'Medium', 'Large'];
const temperatures = ['Hot', 'Cold'];

export default function ProductEditForm() {
    const {
        product,
        categories,
        ingredients: availableIngredients,
        units,
    } = usePage().props as unknown as {
        product: any; // Adjust this to match the structure of the product data you're passing to the page
        categories: AvailableCategory[];
        ingredients: AvailableIngredient[];
        units: AvailableUnit[];
    };

    const [name, setProductName] = useState(product.name);
    const [selectedCategory, setSelectedCategory] = useState(product.category_id);
    const [ingredientList, setIngredientList] = useState<IngredientEntry[]>(
        product.ingredients?.map((ingredient: any) => ({
            id: ingredient.id,
            ingredient: ingredient.ingredient_id,
            quantity: ingredient.pivot.quantity.toString(),
            unit: ingredient.pivot.unit_id.toString(),
        })) || [{ id: '1', ingredient: '', quantity: '', unit: '' }]
    );
    const [variants, setVariants] = useState<ProductVariant[]>(
        product.productVariants?.map((variant: any) => ({
            id: variant.id,
            size: variant.size,
            temperature: variant.temperature,
            price: variant.price.toString(),
        })) || [{ id: '1', size: '', temperature: '', price: '' }]
    );

    const addIngredient = () => {
        setIngredientList([...ingredientList, { id: Date.now().toString(), ingredient: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (id: string) => {
        setIngredientList((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
    };

    const updateIngredient = (id: string, field: keyof IngredientEntry, value: string) => {
        setIngredientList((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)));
    };

    const addVariant = () => {
        setVariants([...variants, { id: Date.now().toString(), size: '', temperature: '', price: '' }]);
    };

    const removeVariant = (id: string) => {
        setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== id) : prev));
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: string) => {
        setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            name,
            category_id: selectedCategory,
            ingredients: ingredientList
                .filter((i) => i.ingredient && i.quantity && i.unit)
                .map((i) => ({
                    ingredient_id: i.ingredient,
                    quantity: parseFloat(i.quantity),
                    unit_id: i.unit,
                })),
            variants: variants
                .filter((v) => v.size && v.temperature && v.price)
                .map((v) => ({
                    size: v.size,
                    temperature: v.temperature,
                    price: parseFloat(v.price),
                })),
        };

        // Update product via Inertia.js PUT request
        router.put(`/products/${product.id}`, formData); // Use product.id for dynamic URL
        console.log('Form Data:', formData);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/products',
        },
        {
            title: 'Edit Product',
            href: `/products/${product.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="mx-auto max-w-4xl space-y-8 p-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Edit Product</h1>
                    <p className="text-muted-foreground">Modify the details to update the product</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-name">Product Name</Label>
                                <Input
                                    id="product-name"
                                    value={name}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name} 
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ingredients */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Ingredients</CardTitle>
                                <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Ingredient
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ingredientList.map((ingredient, index) => (
                                <div key={ingredient.id} className="space-y-4">
                                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label>Ingredient</Label>
                                            <Select
                                                value={ingredient.ingredient}
                                                onValueChange={(value) => updateIngredient(ingredient.id, 'ingredient', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select ingredient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableIngredients.map((ing) => (
                                                        <SelectItem key={ing.id} value={ing.id.toString()}>
                                                            {ing.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={ingredient.quantity}
                                                onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Unit</Label>
                                            <Select value={ingredient.unit} onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeIngredient(ingredient.id)}
                                            disabled={ingredientList.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {index < ingredientList.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Product Variants</CardTitle>
                            <Button onClick={addVariant} type="button" variant="outline" size="sm">
                                <Plus className="mr-1 h-4 w-4" /> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {variants.map((v, i) => (
                                <div key={v.id} className="space-y-4">
                                    <div className="grid items-end gap-4 md:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label>Size</Label>
                                            <Select value={v.size} onValueChange={(val) => updateVariant(v.id, 'size', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sizes.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {s}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Temperature</Label>
                                            <Select value={v.temperature} onValueChange={(val) => updateVariant(v.id, 'temperature', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select temperature" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {temperatures.map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Price</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={v.price}
                                                onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeVariant(v.id)}
                                            disabled={variants.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {i < variants.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button type="submit" size="lg">
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
