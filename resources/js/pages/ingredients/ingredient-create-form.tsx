import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Unit } from '@/types/ingredient';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';

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



export default function IngredientCreateForm( { units = [] }: { units: Unit[] } ) {
    const {data, setData, errors, post, processing} = useForm({
        name: '',
        unit_id: '',
        stock_alert_threshold:''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('ingredients.store'));
    };

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({
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
                                    value={data.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock_alert_threshold">Stock alert threshold</Label>
                                <Input
                                    id="stock_alert_threshold"
                                    type="number"
                                    placeholder="Enter alert quantity"
                                    value={data.stock_alert_threshold}
                                    onChange={(e) => handleInputChange('stock_alert_threshold', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                {errors.stock_alert_threshold && <p className="text-red-500">{errors.stock_alert_threshold}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select value={data.unit_id} onValueChange={(value) => handleInputChange('unit_id', value)}>
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

                            <Button type="submit" className="w-full">
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
