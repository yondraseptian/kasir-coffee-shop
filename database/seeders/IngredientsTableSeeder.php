<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ingredients')->insert([
            [
                'name' => 'Coffee Beans',
                'stock' => 100.00,
                'unit_id' => 2
            ],
            [
                'name' => 'Milk',
                'stock' => 200.00,
                'unit_id' => 4,
            ],
            [
                'name' => 'Sugar',
                'stock' => 50.00,
                'unit_id' => 2,
            ],
            [
                'name' => 'Flour',
                'stock' => 30.00,
                'unit_id' =>  2,
            ],
            [
                'name' => 'Butter',
                'stock' => 20.00,
                'unit_id' => 2,
            ],
        ]);
    }
}
