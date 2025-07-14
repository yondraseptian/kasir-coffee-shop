<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::with(['stockIns', 'stockOuts'])->get();

        return Inertia::render('ingredients/ingredients', [
            'ingredients' => $ingredients->map(function ($ingredient) {
                return [
                    'ingredient_code' => $ingredient->ingredient_code,
                    'name' => $ingredient->name,
                    'unit' => $ingredient->unit->name ?? null,
                    'final_stock' => $ingredient->final_stock,
                    'stock_alert_threshold' => $ingredient->stock_alert_threshold
                ];
            }),
        ]);
    }

    public function create()
    {
        $units = Unit::all();
        return Inertia::render('ingredients/ingredient-create-form', [
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'stock_alert_threshold' => 'nullable|numeric|min:0'
        ]);

        $lastIngredient = Ingredient::latest('id')->first();
        $lastId = $lastIngredient ? $lastIngredient->id : 0;
        $nextId = $lastId + 1;
        $ingredientCode = 'ING' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $ingredient = Ingredient::create([
            'ingredient_code' => $ingredientCode,
            'name' => $request->name,
            'unit_id' => $request->unit_id,
        ]);

        return redirect()->route('ingredients')->with('success', 'Ingredient created successfully!');
    }

    public function edit($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $units = Unit::all();

        $ingredient = [
            'id' => $ingredient->id,
            'name' => $ingredient->name,
            'unit_id' => $ingredient->unit_id,
            'unit' => [
                'id' => $ingredient->unit->id,
                'name' => $ingredient->unit->name,
                'abbreviation' => $ingredient->unit->abbreviation
            ],
        ];

        return Inertia::render('ingredients/ingredient-edit-form', [
            'ingredient' => $ingredient,
            'units' => $units,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'stock_alert_threshold' => 'nullable|numeric|min:0'
        ]);

        $ingredient = Ingredient::findOrFail($id);
        $ingredient->name = $request->name;
        $ingredient->unit_id = $request->unit_id;
        $ingredient->stock_alert_threshold = $request->stock_alert_threshold;
        $ingredient->save();

        return redirect()->route('ingredients.edit', $ingredient->id)->with('success', 'Ingredient updated successfully!')->with('debug', 'flash shold be visible now');
    }

    public function destroy($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();
        return redirect()->route('ingredients')->with('success', 'Ingredient deleted successfully!');
    }
}
