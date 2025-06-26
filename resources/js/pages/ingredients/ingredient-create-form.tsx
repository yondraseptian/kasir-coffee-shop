import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ingredients',
        href: '/ingredients',
    },
    {
        title: 'create',
        href: '/ingredients/create',
    },
];

export default function IngredientCreateForm() {
    const [formData, setFormData] = useState({
        name: '',
        stock: '',
        unit: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('New ingredient:', formData);
        // Handle form submission here
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto w-full max-w-md mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Ingredient</CardTitle>
                        <CardDescription>Add a new ingredient to your inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pieces">Pieces</SelectItem>
                                        <SelectItem value="grams">Grams (g)</SelectItem>
                                        <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                                        <SelectItem value="liters">Liters (L)</SelectItem>
                                        <SelectItem value="milliliters">Milliliters (mL)</SelectItem>
                                        <SelectItem value="cups">Cups</SelectItem>
                                        <SelectItem value="tablespoons">Tablespoons (tbsp)</SelectItem>
                                        <SelectItem value="teaspoons">Teaspoons (tsp)</SelectItem>
                                        <SelectItem value="ounces">Ounces (oz)</SelectItem>
                                        <SelectItem value="pounds">Pounds (lb)</SelectItem>
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
