'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductForm } from '@/hooks/use-product-form';
import type { ProductFormProps } from '@/types/product';
import React, { useState } from 'react';
import { CategorySelector } from './categories-selector';
import { IngredientsManager } from './ingredients-manager';
import { ProductImageUpload } from './product-image-upload';
import { ProductPreview } from './product-preview';

export function ProductForm({
    initialData,
    availableCategories,
    availableIngredients,
    availableUnits,
    showPreview = true,
    onSubmit,
    onCancel,
    submitButtonText = 'Create Product',
    cancelButtonText = 'Cancel',
    title = 'Create New Product',
    className,
}: ProductFormProps) {
    const { formData, updateField, addIngredient, removeIngredient, resetForm } = useProductForm(initialData);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('price', String(formData.price));
        payload.append('category_id', String(formData.category_id));

        if (imageFile) {
            payload.append('image', imageFile);
        }

        formData.ingredients.forEach((ingredient, index) => {
          if (
            ingredient.ingredient_id != null &&
            ingredient.unit_id != null &&
            ingredient.quantity != null
          ) {
            payload.append(`ingredients[${index}][ingredient_id]`, ingredient.ingredient_id.toString());
            payload.append(`ingredients[${index}][quantity]`, ingredient.quantity.toString());
            payload.append(`ingredients[${index}][unit_id]`, ingredient.unit_id.toString());
          }
        });
        onSubmit?.(payload);
    };

    const handleCancel = () => {
        resetForm();
        onCancel?.();
    };

    const formContent = (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-muted-foreground">$</span>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => updateField('price', e.target.value)}
                                placeholder="0.00"
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <CategorySelector
                        categories={availableCategories || []}
                        selectedCategory={formData.category_id}
                        onCategoryChange={(categoryId) => updateField('category_id', categoryId)}
                    />

                    {/* Image Upload */}
                    <ProductImageUpload
                        imagePreview={imageFile ? URL.createObjectURL(imageFile) : null}
                        onImageChange={(file) => {
                            setImageFile(file);
                            updateField('image', file); // tambahkan ini
                        }}
                    />
                    {/* Ingredients */}
                    <IngredientsManager
                        ingredients={formData.ingredients}
                        availableIngredients={availableIngredients || []}
                        availableUnits={availableUnits || []}
                        onAddIngredient={addIngredient}
                        onRemoveIngredient={removeIngredient}
                    />

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1">
                            {submitButtonText}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                            {cancelButtonText}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );

    if (!showPreview) {
        return <div className={className}>{formContent}</div>;
    }

    return (
        <div className={`mx-auto max-w-7xl p-6 ${className || ''}`}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>{formContent}</div>
                <div className="lg:sticky lg:top-6 lg:h-fit">
                    <ProductPreview
                        data={formData}
                        availableCategories={availableCategories}
                        availableIngredients={availableIngredients}
                        availableUnits={availableUnits}
                    />
                </div>
            </div>
        </div>
    );
}
