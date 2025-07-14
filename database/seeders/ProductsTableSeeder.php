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
                'category_id' => 1,
            ],
            [
                'product_code' => 'PRD-002',
                'name' => 'Latte',
                'category_id' => 1,
            ],
            [
                'product_code' => 'PRD-003',
                'name' => 'Espresso',
                'category_id' => 1,
            ],
            [
                'product_code' => 'PRD-004',
                'name' => 'Tea',
                'category_id' => 2,
            ],
            [
                'product_code' => 'PRD-005',
                'name' => 'Croissant',
                'category_id' => 3,
            ]
        ]);
    }
}
