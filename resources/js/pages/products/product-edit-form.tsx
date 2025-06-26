'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface Ingredient {
    ingredientId: number;
    name: string;
    quantity: number;
    unit_id: number;
    unit: string;
    Unit: { id: number; name: string; abbreviation: string };
}

interface ProductImage {
    id: number;
    url: string;
    name: string;
    file?: File;
}

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
}

interface ProductEditProps {
    product: {
        id: number;
        name: string;
        price: number;
        category_id: number;
        image: ProductImage | null;
        ingredients: Ingredient[];
        category: Category;
    };
    categories: Category[];
    ingredients: { id: number; name: string }[];
    units: Unit[];
}

export default function ProductEditForm({
    product: initialProduct,
    categories: initialCategories,
    ingredients: initialIngredients,
    units,
}: ProductEditProps) {
    const [product, setProduct] = useState(initialProduct);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [uploadingImages, setUploadingImages] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Function to handle changes to the product fields
    const handleProductChange = (field: string, value: string | number | null) => {
        setProduct((prev) => ({
            ...prev,
            [field]: field === 'price' ? Number.parseFloat(value as string) || 0 : value,
        }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Function to handle changes to the ingredient fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleIngredientChange = (index: number, field: string, value: any) => {
        const updatedIngredients = [...product.ingredients];

        if (field === 'unit_id') {
            const unitId = parseInt(value);
            const selectedUnit = units.find((u) => u.id === unitId);

            updatedIngredients[index] = {
                ...updatedIngredients[index],
                unit_id: unitId,
                unit: selectedUnit?.name || '',
                Unit: selectedUnit || { id: 0, name: '', abbreviation: '' },
            };
        } else {
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [field]: field === 'quantity' ? parseFloat(value) : value,
            };
        }

        setProduct({ ...product, ingredients: updatedIngredients });
    };

    // Function to add an ingredient to the product
    const addIngredient = () => {
        if (!selectedIngredientId) return;

        const selectedIngredient = initialIngredients.find((ing) => ing.id === Number.parseInt(selectedIngredientId));
        if (!selectedIngredient) return;

        // Check if ingredient already exists
        const existingIngredient = product.ingredients.find((ing) => ing.ingredientId === selectedIngredient.id);
        if (existingIngredient) return;

        const newIngredient: Ingredient = {
            ingredientId: selectedIngredient.id,
            name: selectedIngredient.name,
            quantity: 0,
            unit: '',
            unit_id: 0,
            Unit: {
                id: 0,
                name: '',
                abbreviation: '',
            },
        };

        setProduct((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, newIngredient],
        }));
        setSelectedIngredientId('');
    };

    // Function to remove an ingredient
    const removeIngredient = (index: number) => {
        setProduct((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    // Function to add a new category
    const addNewCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCategory: Category = {
            id: Math.max(...categories.map((c) => c.id)) + 1,
            name: newCategoryName.trim(),
        };

        setCategories((prev) => [...prev, newCategory]);
        setProduct((prev) => ({
            ...prev,
            category_id: newCategory.id,
            category: newCategory,
        }));
        setNewCategoryName('');
        setIsAddCategoryOpen(false);
    };

    // Function to handle image upload
    const handleImageUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.type.startsWith('image/')) {
            const newImage: ProductImage = {
                id: Date.now(),
                url: URL.createObjectURL(file), // preview
                name: file.name,
                file: file, // simpan file asli
            };

            setProduct((prev) => ({
                ...prev,
                image: newImage,
            }));
        }
    };

    // Function to remove the product image
    const removeImage = () => {
        setProduct((prev) => ({
            ...prev,
            image: null,
        }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    // Function to handle save operation
    const handleSave = () => {
        const formData = new FormData();

        formData.append('name', product.name);
        formData.append('category_id', String(product.category_id));
        formData.append('price', product.price.toString());

        // Hanya kirim file image jika file yang baru dipilih (bukan string URL)
        if (product.image?.file) {
            formData.append('image', product.image.file);
        }

        // Tambahkan ingredients manual karena FormData tidak dukung nested array langsung
        product.ingredients.forEach((ing, index) => {
            formData.append(`ingredients[${index}][ingredient_id]`, ing.ingredientId.toString());
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
            formData.append(`ingredients[${index}][unit_id]`, ing.unit_id.toString());
        });

        formData.append('_method', 'PUT');

        Inertia.post(route('products.update', product.id), formData, {
            forceFormData: true, // Penting untuk kirim FormData termasuk file
            onSuccess: () => alert('Product updated successfully!'),
            onError: (errors) => {
                console.error(errors);
                alert('Update failed. Check your input.');
            },
        });
    };

    const selectedCategory = categories.find((cat) => cat.id === product.category_id) || product.category;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            href: '/products',
            title: 'Products',
        },
        {
            href: `/products/${product.id}`,
            title: product.name,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                        <p className="text-muted-foreground">Update product information and ingredients</p>
                    </div>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Basic Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>Basic details about the product</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input
                                    id="productName"
                                    value={product.name}
                                    onChange={(e) => handleProductChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (Rp)</Label>
                                <Input
                                    id="price"
                                    type="string"
                                    step="0.01"
                                    min="0"
                                    value={product.price}
                                    onChange={(e) => handleProductChange('price', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={product.category_id?.toString() || ''}
                                        onValueChange={(value) => handleProductChange('category_id', Number.parseInt(value))}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Category</DialogTitle>
                                                <DialogDescription>Create a new product category</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="newCategory">Category Name</Label>
                                                    <Input
                                                        id="newCategory"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        placeholder="Enter category name"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={addNewCategory}>Add Category</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {selectedCategory && (
                                    <Badge variant="secondary" className="mt-2">
                                        Current: {selectedCategory.name}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                            <CardDescription>Upload a product photo (optional)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.image ? (
                                <div className="space-y-4">
                                    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                                        <img src={product.image.url || ''} alt={product.image.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{product.image.name}</p>
                                            <p className="text-xs text-muted-foreground">Product image</p>
                                        </div>
                                        <Button onClick={removeImage} variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ingredients Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ingredients</CardTitle>
                            <CardDescription>Manage product ingredients and quantities</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Select value={selectedIngredientId} onValueChange={setSelectedIngredientId}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select ingredient to add" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialIngredients
                                            .filter((ing) => !product.ingredients.some((prodIng) => prodIng.ingredientId === ing.id))
                                            .map((ingredient) => (
                                                <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                                                    {ingredient.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={addIngredient} variant="outline" size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {product.ingredients.map((ingredient, index) => (
                                    <div key={ingredient.ingredientId} className="space-y-2">
                                        <div className="flex items-center gap-2 rounded-lg border p-3">
                                            <div className="flex-1">
                                                <div className="font-medium">{ingredient.name}</div>
                                                <div className="text-sm text-muted-foreground">Unit: {ingredient.unit}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={ingredient.quantity}
                                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                    className="w-20"
                                                    placeholder="0"
                                                />
                                                <Select
                                                    value={ingredient.unit_id ? ingredient.unit_id.toString() : ''}
                                                    onValueChange={(value) => handleIngredientChange(index, 'unit_id', parseInt(value))}
                                                >
                                                    <SelectTrigger className="w-28">
                                                        <SelectValue placeholder="Select unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                                {unit.name} ({unit.abbreviation})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    onClick={() => removeIngredient(index)}
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {product.ingredients.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <p>No ingredients added yet</p>
                                        <p className="text-xs">Select an ingredient above to get started</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Summary</CardTitle>
                        <CardDescription>Review your product details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <h3 className="mb-2 font-semibold">Product Details</h3>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="font-medium">Name:</span> {product.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">Category:</span> {selectedCategory?.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">Price:</span> {formatRupiah(product.price)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold">Image</h3>
                                <div className="space-y-1 text-sm">
                                    {product.image ? (
                                        <div className="flex items-center gap-2">
                                            <img src={product.image.url} alt={product.image.name} className="h-8 w-8 rounded object-cover" />
                                            <span className="truncate">{product.image.name}</span>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No image uploaded</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold">Ingredients ({product.ingredients.length})</h3>
                                <div className="space-y-1 text-sm">
                                    {product.ingredients.map((ingredient) => (
                                        <div key={ingredient.ingredientId}>
                                            {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
