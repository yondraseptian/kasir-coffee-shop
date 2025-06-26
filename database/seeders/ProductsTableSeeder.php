<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Cappuccino',
                'price' => 25000.00,
                'category_id' => 1,
                'image' => 'https://example.com/cappuccino.jpg'
            ],
            [
                'name' => 'Latte',
                'price' => 30000.00,
                'category_id' => 1,
                'image' => 'https://example.com/latte.jpg'
            ],
            [
                'name' => 'Espresso',
                'price' => 20000.00,
                'category_id' => 1,
                'image' => 'https://example.com/espresso.jpg'
            ],
            [
                'name' => 'Tea',
                'price' => 15000.00,
                'category_id' => 2,
                'image' => 'https://example.com/tea.jpg'
            ],
            [
                'name' => 'Croissant',
                'price' => 5000.00,
                'category_id' => 3,
                'image' => 'https://example.com/croissant.jpg'
            ]
        ]);
    }
}
