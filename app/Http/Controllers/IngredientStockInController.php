<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientStockIn;
use App\Models\Unit;
use App\Models\UnitConversion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IngredientStockInController extends Controller
{
    public function index()
    {
        $stockIns = IngredientStockIn::with('ingredient', 'unit')->latest()->paginate(20);
        return view('stock_ins.index', compact('stockIns'));
    }

    public function create()
    {
        $ingredients = Ingredient::with('unit')->get();
        $units = Unit::all();

        return Inertia::render('ingredients/stock-in-out-nav', [
            'ingredients' => $ingredients,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_id' => 'required|exists:units,id',
            'price_per_unit' => 'required|numeric|min:0',
            // 'notes' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $ingredient = Ingredient::findOrFail($validated['ingredient_id']);
            $unitIdInput = $validated['unit_id'];
            $unitIdDefault = $ingredient->unit_id;

            $finalQuantity = $validated['quantity'];

            // Konversi jika unit input berbeda dengan unit utama
            if ($unitIdInput != $unitIdDefault) {
                $conversion = UnitConversion::where(function ($query) use ($ingredient) {
                    $query->where('ingredient_id', $ingredient->id)
                        ->orWhereNull('ingredient_id'); // Fallback global
                })
                    ->where('from_unit_id', $unitIdInput)
                    ->where('to_unit_id', $unitIdDefault)
                    ->orderByRaw('ingredient_id IS NULL') // Prioritaskan yang spesifik
                    ->first();


                if (!$conversion) {
                    throw new \Exception("Konversi unit tidak ditemukan untuk bahan ini.");
                }

                $finalQuantity *= $conversion->multiplier;
                $unitIdInput = $unitIdDefault;
            }

            // Simpan stock in
            IngredientStockIn::create([
                'ingredient_id' => $ingredient->id,
                'quantity' => $finalQuantity,
                'unit_id' => $unitIdDefault,
                'price_per_unit' => $validated['price_per_unit'],
                'total_price' => $finalQuantity * $validated['price_per_unit'],
                // 'notes' => $validated['notes'] ?? null,
            ]);

            // Update total stok
            // $ingredient->increment('stock', $finalQuantity);
        });

        return redirect()->route('ingredients')->with('success', 'Stock berhasil ditambahkan.');
    }
}
