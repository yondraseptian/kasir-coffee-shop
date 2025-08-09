<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $units = Unit::all()->keyBy('id');
        $products = Product::with(['category', 'ingredients', 'productVariants'])->get();

        $products = $products->map(function ($product) use ($units) {
            return [
                'product_code' => $product->product_code,
                'name' => $product->name,
                'category_name' => $product->category->name,
                'variants' => $product->productVariants->map(function ($variant) {
                    return [
                        'size' => $variant->size,
                        'temperature' => $variant->temperature,
                        'price' => $variant->price,
                    ];
                }),
                'ingredients' => $product->ingredients->map(function ($ingredient) use ($units) {
                    $unit = $units->get($ingredient->pivot->unit_id);
                    return [
                        'name' => $ingredient->name,
                        'quantity' => $ingredient->pivot->quantity,
                        'unit' => $unit?->abbreviation ?? '',
                    ];
                }),
            ];
        });

        return inertia('products/index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('products/create', [
            'categories' => Category::all(),
            'ingredients' => Ingredient::with('unit')->get(),
            'units' => Unit::all(),
        ]);
    }

    public function edit($id)
    {
        $product = Product::with([
            'category:id,name',
            'ingredients',
            'productVariants'
        ])->findOrFail($id);

        $units = Unit::all()->keyBy('id');

        $productData = $product->toArray();

        $productData['ingredients'] = $product->ingredients->map(function ($ingredient) use ($units) {
            $unitId = $ingredient->pivot->unit_id;
            $unit = $units->get($unitId);
            return [
                'ingredientId' => $ingredient->id,
                'name' => $ingredient->name,
                'quantity' => $ingredient->pivot->quantity,
                'unit_id' => $unitId,
                'unit' => $unit?->abbreviation ?? '',
                'Unit' => [
                    'id' => $unit?->id ?? 0,
                    'name' => $unit?->name ?? '',
                    'abbreviation' => $unit?->abbreviation ?? '',
                ],
            ];
        })->values()->toArray();

        $productData['variants'] = $product->productVariants->map(function ($variant) {
            return [
                'id' => $variant->id,
                'size' => $variant->size,
                'temperature' => $variant->temperature,
                'price' => $variant->price,
            ];
        })->toArray();

        return Inertia::render('products/edit', [
            'product' => $productData,
            'categories' => Category::all(),
            'ingredients' => Ingredient::with('unit')->get(),
            'units' => Unit::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string',
            'variants.*.temperature' => 'required|string',
            'variants.*.price' => 'required|numeric|min:0',
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
            'ingredients.*.unit_id' => 'required|exists:units,id',
        ]);

        $lastProduct = Product::latest('id')->first();
        $lastId = $lastProduct ? $lastProduct->id : 0;
        $nextId = $lastId + 1;
        $productCode = 'PRD' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $product = Product::create([
            'product_code' => $productCode,
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        // Save variants
        foreach ($request->variants as $variant) {
            $product->productVariants()->create([
                'size' => $variant['size'],
                'temperature' => $variant['temperature'],
                'price' => $variant['price'],
            ]);
        }

        // Sync ingredients
        $syncIngredients = [];
        foreach ($request->ingredients as $ingredient) {
            $syncIngredients[$ingredient['ingredient_id']] = [
                'quantity' => $ingredient['quantity'],
                'unit_id' => $ingredient['unit_id'],
            ];
        }
        $product->ingredients()->sync($syncIngredients);

        return redirect()->route('products')->with('success', 'Product created successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string',
            'variants.*.temperature' => 'required|string',
            'variants.*.price' => 'required|numeric|min:0',
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
            'ingredients.*.unit_id' => 'required|exists:units,id',
        ]);

        $product = Product::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        // Hapus dan buat ulang semua varian (bisa diganti soft update kalau mau)
        $product->productVariants()->delete();
        foreach ($request->variants as $variant) {
            $product->productVariants()->create([
                'size' => $variant['size'],
                'temperature' => $variant['temperature'],
                'price' => $variant['price'],
            ]);
        }

        // Sync ingredients
        $ingredients = [];
        foreach ($request->ingredients as $ingredient) {
            $ingredients[$ingredient['ingredient_id']] = [
                'quantity' => $ingredient['quantity'],
                'unit_id' => $ingredient['unit_id'],
            ];
        }
        $product->ingredients()->sync($ingredients);

        return redirect()->route('products')->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->productVariants()->delete(); // hapus semua varian
        $product->delete();

        return redirect()->route('products')->with('success', 'Product deleted successfully!');
    }
}
