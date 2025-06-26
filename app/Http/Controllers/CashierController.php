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
            return $product;
        });

        return Inertia::render('cashier', [
            'products' => $products
        ]);
    }

}
