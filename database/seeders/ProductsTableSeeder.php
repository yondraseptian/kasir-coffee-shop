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
                'product_code' => 'PRD-001',
                'name' => 'Cappuccino',
                'price' => 25000.00,
                'category_id' => 1,
                'image' => 'https://example.com/cappuccino.jpg'
            ],
            [
                'product_code' => 'PRD-002',
                'name' => 'Latte',
                'price' => 30000.00,
                'category_id' => 1,
                'image' => 'https://example.com/latte.jpg'
            ],
            [
                'product_code' => 'PRD-003',
                'name' => 'Espresso',
                'price' => 20000.00,
                'category_id' => 1,
                'image' => 'https://example.com/espresso.jpg'
            ],
            [
                'product_code' => 'PRD-004',
                'name' => 'Tea',
                'price' => 15000.00,
                'category_id' => 2,
                'image' => 'https://example.com/tea.jpg'
            ],
            [
                'product_code' => 'PRD-005',
                'name' => 'Croissant',
                'price' => 5000.00,
                'category_id' => 3,
                'image' => 'https://example.com/croissant.jpg'
            ]
        ]);
    }
}
