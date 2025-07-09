'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Ingredient } from '@/types/product';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface AvailableIngredient {
    id: number;
    name: string;
    quantity: number;
    unit_id: number;
}

interface UnitOption {
    id: number;
    name: string;
    abbreviation: string;
}

interface IngredientsManagerProps {
    ingredients: Ingredient[];
    availableIngredients: AvailableIngredient[];
    availableUnits: UnitOption[];
    onAddIngredient: (ingredient: Ingredient) => void;
    onRemoveIngredient: (ingredientName: string) => void;
    label?: string;
}

export function IngredientsManager({
    ingredients,
    availableIngredients,
    availableUnits,
    onAddIngredient,
    onRemoveIngredient,
    label = 'Ingredients',
}: IngredientsManagerProps) {
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState('');
    const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

    const handleAddIngredient = () => {
        if (selectedIngredientId && quantity && selectedUnitId) {
            const newIngredient: Ingredient = {
                ingredient_id: selectedIngredientId,
                quantity: parseFloat(quantity),
                unit_id: selectedUnitId,
            };

            if (!ingredients.some((ing) => ing.ingredient_id === selectedIngredientId)) {
                onAddIngredient(newIngredient);
                setSelectedIngredientId(null);
                setQuantity('');
                setSelectedUnitId(null);
            }
        }
    };

    const availableIngredientOptions = availableIngredients.filter((ingredient) => !ingredients.some((ing) => ing.name === ingredient.name));

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2">
                    {/* Ingredient Select */}
                    <Select value={selectedIngredientId?.toString() ?? ''} onValueChange={(val) => setSelectedIngredientId(Number(val))}>
                        <SelectTrigger className='col-span-4'>
                            <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableIngredientOptions.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                                    {ingredient.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Quantity Input */}
                    <div className="col-span-3">
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Quantity"
                        />
                    </div>

                    {/* Unit Select */}
                    <Select value={selectedUnitId?.toString() ?? ''} onValueChange={(val) => setSelectedUnitId(Number(val))}>
                        <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableUnits.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                    {unit.name} ({unit.abbreviation})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Add Button */}
                    <div className="col-span-1">
                        <Button
                            type="button"
                            onClick={handleAddIngredient}
                            disabled={!selectedIngredientId || !quantity || !selectedUnitId}
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* List of Added Ingredients */}
                {ingredients.map((ingredient, index) => {
                    const ing = availableIngredients.find((i) => i.id === ingredient.ingredient_id);
                    const unit = availableUnits.find((u) => u.id === ingredient.unit_id);
                    return (
                        <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                            <span className="font-medium">
                                {ingredient.quantity} {unit?.abbreviation} of {ing?.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => onRemoveIngredient(ing?.name || '')}
                                className="text-muted-foreground transition-colors hover:text-destructive"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
