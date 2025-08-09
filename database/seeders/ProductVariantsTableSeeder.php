<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductVariantsTableSeeder extends Seeder
{
    public function run(): void
    {
        $cappuccino = Product::where('product_code', 'PRD-001')->first();
        $latte = Product::where('product_code', 'PRD-002')->first();
        $espresso = Product::where('product_code', 'PRD-003')->first();
        $tea = Product::where('product_code', 'PRD-004')->first();
        $croissant = Product::where('product_code', 'PRD-005')->first();

        $cappuccino->productVariants()->createMany([
            ['size' => 'Small', 'temperature' => 'Hot', 'price' => 22000],
            ['size' => 'Medium', 'temperature' => 'Hot', 'price' => 25000],
            ['size' => 'Large', 'temperature' => 'Hot', 'price' => 28000],
        ]);

        $latte->productVariants()->createMany([
            ['size' => 'Small', 'temperature' => 'Hot', 'price' => 27000],
            ['size' => 'Medium', 'temperature' => 'Hot', 'price' => 30000],
            ['size' => 'Large', 'temperature' => 'Hot', 'price' => 33000],
        ]);

        $espresso->productVariants()->createMany([
            ['size' => 'Single', 'temperature' => 'Hot', 'price' => 20000],
            ['size' => 'Double', 'temperature' => 'Hot', 'price' => 25000],
        ]);

        $tea->productVariants()->createMany([
            ['size' => 'Regular', 'temperature' => 'Cold', 'price' => 15000],
        ]);

        $croissant->productVariants()->createMany([
            ['size' => 'Standard', 'temperature' => null, 'price' => 5000],
        ]);
    }
}
