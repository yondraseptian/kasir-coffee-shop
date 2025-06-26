<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientController extends Controller
{
    public function index(){
        $ingredients = Ingredient::all();

        return Inertia::render('ingredients/ingredients', [
            'ingredients' => $ingredients
        ]);
    }

    public function create(){
        return Inertia::render('ingredients/ingredient-create-form');
    }
}
