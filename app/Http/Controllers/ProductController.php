<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $units = \App\Models\Unit::all()->keyBy('id');

        $products = Product::with(['category', 'ingredients'])->get();

        $products = $products->map(function ($product) use ($units) {
            $ingredients = $product->ingredients->map(function ($ingredient) use ($units) {
                $unitName = $units[$ingredient->pivot->unit_id]->abbreviation ?? 'Unknown';

                return [
                    'name' => $ingredient->name,
                    'quantity' => $ingredient->pivot->quantity,
                    'unit' => $unitName,
                ];
            });

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'category_name' => $product->category->name,
                'ingredients' => $ingredients,
            ];
        });

        return inertia('products/products', [
            'products' => $products,
        ]);
    }




    public function create()
    {
        return Inertia::render('products/product-create-form', [
            'categories' => Category::all()->toArray(),
            'ingredients' => Ingredient::with('unit')->get()->toArray(),
            'units' => Unit::all()->toArray(),
        ]);
    }

    public function edit($id)
    {
        $product = Product::with([
            'category:id,name',
            'ingredients' => function ($query) {
                $query->select('ingredients.id', 'name');
            },
        ])->findOrFail($id);



        // Transform ingredients and other necessary fields
        $productData = $product->toArray();
        $units = Unit::all()->keyBy('id');

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
        $productData['image'] = $product->image
            ? [
                'url' => asset('storage/' . $product->image),
                'name' => basename($product->image),
            ]
            : null;

        return Inertia::render('products/product-edit-form', [
            'product' => $productData,
            'categories' => Category::all()->toArray(),
            'ingredients' => Ingredient::with('unit')->get()->toArray(),
            'units' => Unit::all()->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric',
            'ingredients.*.unit_id' => 'required|exists:units,id',
        ]);

        // Mengunggah gambar produk (jika ada)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        // Menyimpan data produk
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'image' => $imagePath,
        ]);

        // Menyimpan bahan-bahan produk (many-to-many relationship dengan pivot)
        $ingredients = [];
        foreach ($request->ingredients as $ingredient) {
            $ingredients[$ingredient['ingredient_id']] = [
                'quantity' => $ingredient['quantity'],
                'unit_id' => $ingredient['unit_id'],
            ];
        }

        $product->ingredients()->sync($ingredients);

        return redirect()->route('products')->with('success', 'Product created successfully!');
    }

    // Menyimpan kategori baru
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create(['name' => $request->name]);

        return Inertia::render('products/product-create-form', [
            'categories' => Category::all()->toArray(),
            'ingredients' => Ingredient::all()->toArray(),
        ]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric',
            'ingredients.*.unit_id' => 'required|exists:units,id',

        ]);

        $product = Product::with(['category', 'ingredients'])->findOrFail($id);


        // Update product information
        $product->name = $request->name;
        $product->price = $request->price;
        $product->category_id = $request->category_id;
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $product->image = $path;
        }
        $product->save();

        // Sync ingredients (many-to-many relationship with pivot)
        $ingredients = [];
        foreach ($request->ingredients as $ingredient) {
            $ingredients[$ingredient['ingredient_id']] = [
                'quantity' => $ingredient['quantity'],
                'unit_id' => $ingredient['unit_id'],
            ];
        }

        $product->ingredients()->sync($ingredients);

        return redirect()->route('products')->with('success', 'Product updated successfully!')->with('success', 'Product updated successfully!');
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('products')->with('success', 'Product deleted successfully!');
    }
}
