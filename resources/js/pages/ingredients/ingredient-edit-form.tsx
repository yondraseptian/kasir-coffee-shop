"use client";
import { AlertMessage } from '@/components/alert-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/inertia';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';

interface Ingredient {
    id: number;
    name: string;
    stock: number;
    unit_id: number;
    unit: {
        id: number;
        name: string;
        abbreviation: string;
    };
}

interface Unit {
    id: number;
    name: string;
    abbreviation: string;
}

interface IngredientEditFormProps {
    ingredient: Ingredient;
    units: Unit[];
}

export default function IngredientEditForm({ ingredient, units }: IngredientEditFormProps) {
    const [formData, setFormData] = useState(ingredient);
    const { flash } = usePage<PageProps>().props;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSave = () => {
        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('stock', formData.stock.toString());
        formPayload.append('unit_id', formData.unit_id.toString());    
        formPayload.append('_method', 'PUT');
        Inertia.post(route('ingredients.update', ingredient.id), formPayload, {
            forceFormData: true,
            preserveState: false,
            onSuccess: () => {
                
            },
            onError: (errors) => {
                console.error(errors);
                alert('Update failed. Check your input.');
            },
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'ingredients',
            href: '/ingredients',
        },
        {
            title: ingredient.name,
            href: '/ingredients/' + ingredient.id,
        },
    ];
    console.log('page props', usePage().props);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {showAlert && <AlertMessage variant="success" title="Success!" description={flash.success} />}
            <div className="mx-auto mt-10 w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Ingredient</CardTitle>
                        <CardDescription>Add a new ingredient to your inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form  onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter ingredient name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="Enter stock quantity"
                                    value={formData.stock}
                                    onChange={(e) => handleInputChange('stock', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select value={formData.unit_id.toString()} onValueChange={(value) => handleInputChange('unit_id', value)}>
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
                            </div>

                            <Button type="submit" className="w-full">
                                Create Ingredient
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
