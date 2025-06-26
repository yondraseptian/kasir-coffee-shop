'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatRupiah } from '@/lib/utils';
import { Inertia } from '@inertiajs/inertia';
import { ArrowLeft, ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';
import React, { FormEventHandler, useState } from 'react';

// Ingredient and Product Image types
interface Ingredient {
    ingredientId: number;
    name: string;
    quantity: number;
    unit: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    url: string;
    name: string;
}

// Type for product state, explicitly define category_id as number or null
interface ProductState {
    name: string;
    category_id: number | null;
    price: number;
    image: ProductImage | null;
    ingredients: Ingredient[];
}
// Initial state for the product
const initialProduct = {
    name: '',
    category_id: null,
    price: 0,
    image: null,
    ingredients: [] as Ingredient[],
};

interface Ingredient {
    ingredientId: number;
    name: string;
    quantity: number;
    unit_id: number;
    Unit: {
        id: number;
        name: string;
        abbreviation: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    url: string;
    name: string;
    file: File;
}

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
}

interface ProductCreateFormProps {
    categories: Category[];
    ingredients: { id: number; name: string }[];
    units: Unit[];
}

export default function ProductCreateForm({ categories = [], ingredients = [], units = [] }: ProductCreateFormProps) {
    const [product, setProduct] = useState<ProductState>(initialProduct);
    const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handle field changes for product details
    const handleProductChange = (field: string, value: string | number | null) => {
        setProduct((prev) => ({
            ...prev,
            [field]: field === 'price' ? Number.parseFloat(value as string) || 0 : value,
        }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Handle ingredient field changes
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

    // Add ingredient to the product
    const addIngredient = () => {
        if (!selectedIngredientId) return;

        const selectedIngredient = ingredients.find((ing) => ing.id === Number.parseInt(selectedIngredientId));
        if (!selectedIngredient) return;

        // Prevent adding duplicate ingredients
        const existingIngredient = product.ingredients.find((ing) => ing.ingredientId === selectedIngredient.id);
        if (existingIngredient) return;

        const newIngredient: Ingredient = {
            ingredientId: selectedIngredient.id,
            name: selectedIngredient.name,
            quantity: 0,
            unit_id: 1,
            unit: '',
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

    // Remove ingredient from the product
    const removeIngredient = (index: number) => {
        setProduct((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    // Handle image file upload
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

    // Remove image from the product
    const removeImage = () => {
        setProduct((prev) => ({
            ...prev,
            image: null,
        }));
    };

    // Handle drag events for image upload
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop event for image upload
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!product.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!product.category_id) {
            newErrors.category_id = 'Please select a category';
        }

        if (product.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (product.ingredients.length === 0) {
            newErrors.ingredients = 'At least one ingredient is required';
        }

        // Validate ingredients
        product.ingredients.forEach((ingredient, index) => {
            if (ingredient.quantity <= 0) {
                newErrors[`ingredient_${index}_quantity`] = 'Quantity must be greater than 0';
            }
            if (!ingredient.unit.trim()) {
                newErrors[`ingredient_${index}_unit`] = 'Unit is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('category_id', product.category_id.toString());
        formData.append('price', product.price.toString());

        // Masukkan image jika ada dan valid
        if (product.image && product.image.file instanceof File) {
            formData.append('image', product.image.file);
        }

        product.ingredients.forEach((ing, index) => {
            formData.append(`ingredients[${index}][ingredient_id]`, ing.ingredientId.toString());
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
            formData.append(`ingredients[${index}][unit_id]`, ing.unit_id.toString());
        });

        setIsSubmitting(true);

        try {
            await Inertia.post(route('products.store'), formData, {
                forceFormData: true, // <- PENTING untuk Inertia agar mengirim FormData, bukan JSON
                onFinish: () => {
                    setProduct(initialProduct);
                    setErrors({});
                },
            });

            alert('Product created successfully!');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add new category to the list
    const addNewCategory: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await Inertia.post(route('categories.store'), {
                name: newCategoryName,
            });

            if (response.status === 201) {
                setCategoriesList((prev) => [...prev, response.data]);
                setNewCategoryName('');
            }
        } catch (error) {
            console.error('Error adding new category:', error);
        }
    };

    // Handle cancel action (e.g., navigate back to product list)
    const handleCancel = () => {
        console.log('Cancel creation');
    };

    // Get the selected category for display
    const selectedCategory = categoriesList.find((cat) => cat.id === product.category_id);

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Product</h1>
                        <p className="text-muted-foreground">Add a new product to your inventory</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>Basic details about the product</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name *</Label>
                                <Input
                                    id="productName"
                                    value={product.name}
                                    onChange={(e) => handleProductChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (Rp) *</Label>
                                <Input
                                    id="price"
                                    type="string"
                                    step="0.01"
                                    min="0"
                                    value={product.price}
                                    onChange={(e) => handleProductChange('price', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.price ? 'border-red-500' : ''}
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={product.category_id?.toString() || ''}
                                        onValueChange={(value) => handleProductChange('category_id', Number.parseInt(value))}
                                    >
                                        <SelectTrigger className={`flex-1 ${errors.category_id ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriesList.map((category) => (
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
                                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                {selectedCategory && (
                                    <Badge variant="secondary" className="mt-2">
                                        Selected: {selectedCategory.name}
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
                            <CardTitle>Ingredients *</CardTitle>
                            <CardDescription>Add ingredients and their quantities</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add New Ingredient */}
                            <div className="flex gap-2">
                                <Select value={selectedIngredientId} onValueChange={setSelectedIngredientId}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select ingredient to add" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ingredients
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

                            {errors.ingredients && <p className="text-sm text-red-500">{errors.ingredients}</p>}

                            {/* Current Ingredients */}
                            <div className="space-y-3">
                                {product.ingredients.map((ingredient, index) => (
                                    <div key={ingredient.ingredientId} className="space-y-2">
                                        <div className="flex items-center gap-2 rounded-lg border p-3">
                                            <div className="flex-1">
                                                <div className="font-medium">{ingredient.name}</div>
                                                <div className="text-xs text-muted-foreground">{ingredient.unit}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={ingredient.quantity}
                                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                    className={`w-20 ${errors[`ingredient_${index}_quantity`] ? 'border-red-500' : ''}`}
                                                    placeholder="0"
                                                />
                                                <Select
                                                    value={ingredient.unit_id?.toString()}
                                                    onValueChange={(value) => handleIngredientChange(index, "unit_id", value)}
                                                >
                                                    <SelectTrigger className={`w-28 ${errors[`ingredient_${index}_unit`] ? 'border-red-500' : ''}`}>
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
                                        {(errors[`ingredient_${index}_quantity`] || errors[`ingredient_${index}_unit`]) && (
                                            <div className="ml-3 text-sm text-red-500">
                                                {errors[`ingredient_${index}_quantity`] || errors[`ingredient_${index}_unit`]}
                                            </div>
                                        )}
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

                {(product.name || product.category_id || product.ingredients.length > 0) && (
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Product Preview</CardTitle>
                            <CardDescription>Review your new product details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <h3 className="mb-2 font-semibold">Product Details</h3>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <span className="font-medium">Name:</span> {product.name || 'Not set'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Category:</span> {selectedCategory?.name || 'Not selected'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Price:</span> {formatRupiah(product.price || 0)}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">Image</h3>
                                    <div className="space-y-1 text-sm">
                                        {product.image ? (
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={product.image.url || '/placeholder.svg'}
                                                    alt={product.image.name}
                                                    className="h-8 w-8 rounded object-cover"
                                                />
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
                                        {product.ingredients.length > 0 ? (
                                            product.ingredients.map((ingredient) => (
                                                <div key={ingredient.ingredientId}>
                                                    {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No ingredients added</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-4"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button> */}
            </form>
        </div>
    );
}
