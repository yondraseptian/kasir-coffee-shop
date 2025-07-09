'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Ingredient, Unit } from '@/types/ingredient';
import { useForm } from '@inertiajs/react';
import { Minus, PackageMinus } from 'lucide-react';

const reasons = [
    { value: 'sale', label: 'Sale/Customer Order' },
    { value: 'production', label: 'Used in Production' },
    { value: 'waste', label: 'Waste/Spoiled' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'expired', label: 'Expired' },
    { value: 'transfer', label: 'Transfer to Another Location' },
    { value: 'sample', label: 'Sample/Testing' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'return', label: 'Return to Supplier' },
    { value: 'other', label: 'Other' },
];

export default function StockOutForm({ units = [], ingredients = [] }: { units: Unit[]; ingredients: Ingredient[] }) {
    const { data, setData, errors, post, processing } = useForm({
        ingredient_id: '',
        quantity: '',
        unit_id: '',
        reason: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stockOut.store'));
    };

    const isFormValid = data.ingredient_id && data.unit_id && data.quantity && data.reason;

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <PackageMinus className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Remove Stock</CardTitle>
                    <CardDescription>Record items being removed from inventory</CardDescription>
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

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    value={data.quantity}
                                    onChange={(e) => setData((prev) => ({ ...prev, quantity: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Removal</Label>
                            <Select value={data.reason} onValueChange={(value) => setData((prev) => ({ ...prev, reason: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reasons.map((reason) => (
                                        <SelectItem key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any additional details..."
                                value={data.notes}
                                onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!isFormValid || processing}>
                            <Minus className="mr-2 h-4 w-4" />
                            Remove from Stock
                        </Button>
                    </form>

                    {/* Preview of entered data */}
                    {isFormValid && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                            <h3 className="mb-2 text-sm font-medium text-red-800">Removal Summary:</h3>
                            <div className="text-sm text-red-700">
                                <p>
                                    <span className="font-medium">Item:</span> {ingredients.find((i) => i.id.toString() === data.ingredient_id)?.name}
                                </p>
                                <p>
                                    <span className="font-medium">Quantity:</span> {data.quantity}{' '}
                                    {units.find((u) => u.id.toString() === data.unit_id)?.name}
                                </p>
                                <p>
                                    <span className="font-medium">Reason:</span> {reasons.find((r) => r.value === data.reason)?.label}
                                </p>
                                {data.notes && (
                                    <p>
                                        <span className="font-medium">Notes:</span> {data.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
