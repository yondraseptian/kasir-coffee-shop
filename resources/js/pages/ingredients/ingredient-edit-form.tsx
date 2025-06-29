import { AlertMessage } from '@/components/alert-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/inertia';
import { useForm, usePage } from '@inertiajs/react';
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
  const { flash } = usePage<PageProps>().props;
  const [showAlert, setShowAlert] = useState(false);

  const { data, setData, errors, put, processing } = useForm({
    name: ingredient.name,
    stock: ingredient.stock,
    unit_id: ingredient.unit_id,
  });

  useEffect(() => {
    if (flash?.success) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(route('ingredients.update', ingredient.id));
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Ingredients',
      href: '/ingredients',
    },
    {
      title: ingredient.name,
      href: `/ingredients/${ingredient.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {showAlert && (
        <AlertMessage variant="success" title="Success!" description={flash.success ?? ''} />
      )}

      <div className="mx-auto mt-10 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Edit Ingredient</CardTitle>
            <CardDescription>Update ingredient details</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData('stock', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
                {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={data.unit_id.toString()}
                  onValueChange={(value) => setData('unit_id', parseInt(value))}
                >
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
                {errors.unit_id && <p className="text-sm text-red-600">{errors.unit_id}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? 'Saving...' : 'Update Ingredient'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
