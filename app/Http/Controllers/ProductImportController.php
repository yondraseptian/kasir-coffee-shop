<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Unit;
use App\Models\ProductIngredient;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsExport;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Log;

class ProductImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.product_code' => 'required|string|distinct|unique:products,product_code',
            'products.*.name' => 'required|string',
            'products.*.category_name' => 'required|string',
            'products.*.price' => 'required|numeric',
        ]);

        foreach ($request->products as $data) {
            $category = Category::where('name', $data['category_name'])->first();
            if (!$category) continue;

            $product = Product::create([
                'product_code' => $data['product_code'],
                'name' => $data['name'],
                'price' => $data['price'],
                'category_id' => $category->id,
                'image' => $data['image'] ?? null,
            ]);

            if (!empty($data['ingredients'])) {
                $ingredients = explode(',', $data['ingredients']);
                foreach ($ingredients as $entry) {
                    [$ingredientName, $quantity, $unitName] = array_map('trim', explode(':', $entry));
                    $ingredient = Ingredient::where('name', $ingredientName)->first();
                    $unit = Unit::where('name', $unitName)->first();

                    if ($ingredient && $unit) {
                        ProductIngredient::create([
                            'product_id' => $product->id,
                            'ingredient_id' => $ingredient->id,
                            'quantity' => (float) $quantity,
                            'unit_id' => $unit->id,
                        ]);
                    }
                }
            }
        }

        return response()->json(['success' => true]);
    }

    public function export()
{
    return Excel::download(new ProductsExport, 'produk.xlsx');
}
}
