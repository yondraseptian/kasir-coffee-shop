<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashierController extends Controller
{
    public function index() {
        $products = Product::with('category')->get();

        $products = $products->map(function ($product) {
            $product->category_name = $product->category->name;

            $product->variants = $product->productVariants->map(function ($variant) {
                return [
                    'size' => $variant->size,
                    'temperature' => $variant->temperature,
                    'price' => $variant->price
                ];
            });

            return $product;
        });

        return Inertia::render('cashier', [
            'products' => $products
        ]);

    }

}
