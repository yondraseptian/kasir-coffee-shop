<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Unit;
use App\Models\UnitConversion;
use App\Models\IngredientStockOut;
use App\Models\IngredientStockIn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientStockOutController extends Controller
{
    public function index()
    {
        $stockOuts = IngredientStockOut::with(['ingredient', 'unit'])->latest()->get();
        return Inertia::render('StockOut/Index', [
            'stockOuts' => $stockOuts
        ]);
    }

    public function create()
    {
        return Inertia::render('StockOut/Create', [
            'ingredients' => Ingredient::with('unit')->get(),
            'units' => Unit::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_id' => 'required|exists:units,id',
            'reason' => 'nullable|string|max:255',
        ]);

        $ingredient = Ingredient::findOrFail($validated['ingredient_id']);
        $unitIdInput = $validated['unit_id'];
        $unitIdDefault = $ingredient->unit_id;
        $quantityInput = $validated['quantity'];

        $finalQuantity = $quantityInput;

        // ✅ Konversi jika unit input != unit default (global atau khusus)
        if ($unitIdInput != $unitIdDefault) {
            $conversion = UnitConversion::where(function ($query) use ($ingredient) {
                    $query->where('ingredient_id', $ingredient->id)
                          ->orWhereNull('ingredient_id'); // Global fallback
                })
                ->where('from_unit_id', $unitIdInput)
                ->where('to_unit_id', $unitIdDefault)
                ->first();

            if (!$conversion) {
                return back()->withErrors(['unit_id' => 'Konversi unit tidak ditemukan untuk bahan ini.']);
            }

            $finalQuantity = $quantityInput * $conversion->multiplier;
        }

        // ✅ Ambil harga dari stock in terakhir (atau bisa pakai FIFO)
        $lastStockIn = IngredientStockIn::where('ingredient_id', $ingredient->id)
            ->latest()
            ->first();

        if (!$lastStockIn) {
            return back()->withErrors(['ingredient_id' => 'Bahan ini belum memiliki riwayat stock in.']);
        }

        $pricePerUnit = $lastStockIn->price_per_unit;
        $cost = $finalQuantity * $pricePerUnit;

        // ✅ Simpan ke table stock_out
        IngredientStockOut::create([
            'ingredient_id' => $ingredient->id,
            'unit_id' => $unitIdInput, // simpan unit input untuk pelacakan
            'quantity' => $finalQuantity,
            'price_per_unit' => $pricePerUnit,
            'cost' => $cost,
            'reason' => $validated['reason'],
        ]);

        return redirect()->route('ingredients')->with('success', 'Stock out berhasil disimpan!');
    }
}
