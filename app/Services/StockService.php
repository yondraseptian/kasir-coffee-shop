<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\IngredientStockIn;
use App\Models\ProductIngredient;
use App\Models\UnitConversion;
use Illuminate\Support\Facades\DB;

class StockService
{
    public static function consumeIngredients($productId, $productQty)
    {
        $recipe = ProductIngredient::where('product_id', $productId)->get();

        foreach ($recipe as $item) {
            $ingredient = $item->ingredient;
            $unitFrom = $item->unit_id;
            $unitTo = $ingredient->unit_id;

            // Hitung total kebutuhan bahan (dalam unit utama bahan)
            $totalQty = $item->quantity * $productQty;

            if ($unitFrom != $unitTo) {
                $conversion = UnitConversion::where(function($q) use ($ingredient) {
                        $q->where('ingredient_id', $ingredient->id)
                          ->orWhereNull('ingredient_id');
                    })
                    ->where('from_unit_id', $unitFrom)
                    ->where('to_unit_id', $unitTo)
                    ->firstOrFail();

                $totalQty *= $conversion->multiplier;
            }

            self::reduceStockFIFO($ingredient->id, $totalQty);
        }
    }

    protected static function reduceStockFIFO($ingredientId, $qtyNeeded)
    {
        $stockIns = IngredientStockIn::where('ingredient_id', $ingredientId)
            ->whereColumn('quantity', '>', 'used_quantity')
            ->orderBy('created_at') // FIFO
            ->get();

        foreach ($stockIns as $stock) {
            $available = $stock->quantity - $stock->used_quantity;

            if ($available <= 0) continue;

            $used = min($available, $qtyNeeded);
            $stock->used_quantity += $used;
            $stock->save();

            $qtyNeeded -= $used;

            if ($qtyNeeded <= 0) break;
        }

        if ($qtyNeeded > 0) {
            throw new \Exception("Stok bahan tidak cukup untuk digunakan.");
        }
    }
}

