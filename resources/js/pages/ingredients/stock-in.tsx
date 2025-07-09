'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatRupiah } from '@/lib/utils';
import { Ingredient, Unit } from '@/types/ingredient';
import { useForm } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';

export default function Component({ units = [], ingredients = [] }: { units: Unit[]; ingredients: Ingredient[] }) {
    const { data, setData, errors, post, processing } = useForm({
        ingredient_id: '',
        quantity: '',
        unit_id: '',
        price_per_unit: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stockIn.store'));
    };

    const isFormValid = data.ingredient_id && data.quantity && data.unit_id && data.price_per_unit;

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Add Stock Item</CardTitle>
                    <CardDescription>Enter the details for your new stock item</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ingredient">Ingredient</Label>
                            <Select value={data.ingredient_id} onValueChange={(value) => setData('ingredient_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an ingredient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ingredients.map((ingredient) => (
                                        <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                                            {ingredient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.ingredient_id && <p className="text-red-500">{errors.ingredient_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                />
                                {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select value={data.unit_id} onValueChange={(value) => setData('unit_id', value)}>
                                    <SelectTrigger>
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
                                {errors.unit_id && <p className="text-red-500">{errors.unit_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_per_unit">Price per Unit (Rp)</Label>
                            <Input
                                id="price_per_unit"
                                type="number"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={data.price_per_unit}
                                onChange={(e) => setData('price_per_unit', e.target.value)}
                            />
                            {errors.price_per_unit && <p className="text-red-500">{errors.price_per_unit}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={!isFormValid || processing}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Stock
                        </Button>
                    </form>

                    {/* Preview */}
                    {isFormValid && (
                        <div className="mt-6 rounded-lg bg-gray-100 p-4">
                            <h3 className="mb-2 text-sm font-medium text-gray-700">Preview:</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">Item:</span>{' '}
                                    {ingredients.find((i) => i.id.toString() === data.ingredient_id)?.name ?? ''}
                                </p>
                                <p>
                                    <span className="font-medium">Quantity:</span> {data.quantity}{' '}
                                    {units.find((u) => u.id.toString() === data.unit_id)?.name ?? ''}
                                </p>
                                <p>
                                    <span className="font-medium">Price:</span> {formatRupiah(parseFloat(data.price_per_unit))} per{' '}
                                    {units.find((u) => u.id.toString() === data.unit_id)?.abbreviation ?? ''}
                                </p>
                                <p>
                                    <span className="font-medium">Total Value:</span>{' '}
                                    {formatRupiah((parseFloat(data.quantity) || 0) * (parseFloat(data.price_per_unit) || 0))}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
