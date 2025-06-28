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
        $ingredients = Ingredient::all();

        $ingredients = $ingredients->map(function ($ingredient) {
            return [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'stock' => $ingredient->stock,
                'unit' => $ingredient->unit->name,
                'unit_id' => $ingredient->unit_id,
            ];
        });

        return Inertia::render('ingredients/ingredients', [
            'ingredients' => $ingredients,            
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
            'stock' => 'required|numeric',
            'unit_id' => 'required|exists:units,id',
        ]);

        $ingredient = Ingredient::create([
            'name' => $request->name,
            'stock' => $request->stock,
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
            'stock' => $ingredient->stock,
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
            'stock' => 'required|numeric',
            'unit_id' => 'required|exists:units,id',
        ]);

        $ingredient = Ingredient::findOrFail($id);
        $ingredient->name = $request->name;
        $ingredient->stock = $request->stock;
        $ingredient->unit_id = $request->unit_id;
        $ingredient->save();

        return redirect()->route('ingredients.edit', $ingredient->id)->with('success', 'Ingredient updated successfully!')->with('debug', 'flash shold be visible now');
    }
}
