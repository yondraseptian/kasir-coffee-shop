<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\ProductIngredient;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProductsImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        // Lewati header
        $rows->shift();

        foreach ($rows as $row) {
            // Ambil category_id berdasarkan nama
            $category = Category::where('name', $row[3])->first();

            if (!$category) {
                // Skip jika kategori tidak ditemukan
                continue;
            }

            // Simpan produk
            $product = Product::create([
                'product_code' => $row[0],
                'name' => $row[1],
                'price' => $row[2],
                'category_id' => $category->id,
                'image' => $row[4], // Handle upload file terpisah
            ]);

            $ingredientsRaw = $row[5]; // Contoh: "Tepung:2:Gram,Gula:1.5:Gram"

            if ($ingredientsRaw) {
                $ingredients = explode(',', $ingredientsRaw);

                foreach ($ingredients as $ingredientString) {
                    [$ingredientName, $quantity, $unitName] = explode(':', $ingredientString);

                    $ingredient = Ingredient::where('name', $ingredientName)->first();
                    $unit = Unit::where('name', $unitName)->first();

                    if ($ingredient && $unit) {
                        ProductIngredient::create([
                            'product_id' => $product->id,
                            'ingredient_id' => $ingredient->id,
                            'quantity' => $quantity,
                            'unit_id' => $unit->id,
                        ]);
                    }
                }
            }
        }
    }
}

