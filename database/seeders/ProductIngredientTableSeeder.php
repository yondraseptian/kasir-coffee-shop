<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductIngredientTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_ingredient')->insert([
            [
                'product_id' => 1, // Cappuccino
                'ingredient_id' => 1, // Coffee Beans
                'quantity' => 50, // 50g
                'unit_id' => 1,
            ],
            [
                'product_id' => 1, // Cappuccino
                'ingredient_id' => 2, // Milk
                'quantity' => 250, // 250ml
                'unit_id' => 3,
            ],
            [
                'product_id' => 2, // Latte
                'ingredient_id' => 1, // Coffee Beans
                'quantity' => 50, // 50g
                'unit_id' => 1,
            ],
            [
                'product_id' => 2, // Latte
                'ingredient_id' => 2, // Milk
                'quantity' => 300, // 300ml
                'unit_id' => 3,
            ],
            [
                'product_id' => 3, // Espresso
                'ingredient_id' => 1, // Coffee Beans
                'quantity' => 50, // 50g
                'unit_id' => 1,
            ],
            [
                'product_id' => 4, // Tea
                'ingredient_id' => 3, // Sugar
                'quantity' => 20, // 20g
                'unit_id' => 1,
            ],
            [
                'product_id' => 5, // Croissant
                'ingredient_id' => 4, // Flour
                'quantity' => 150, // 150g
                'unit_id' => 1,
            ],
            [
                'product_id' => 5, // Croissant
                'ingredient_id' => 5, // Butter
                'quantity' => 100, // 100g
                'unit_id' => 1,
            ],
        ]);
    }
}
