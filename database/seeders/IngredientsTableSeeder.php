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
                'ingredient_code' => 'ING-001',
                'name' => 'Coffee Beans',
                'unit_id' => 2
            ],
            [
                'ingredient_code' => 'ING-002',
                'name' => 'Milk',
                'unit_id' => 4,
            ],
            [
                'ingredient_code' => 'ING-003',
                'name' => 'Sugar',
                'unit_id' => 2,
            ],
            [
                'ingredient_code' => 'ING-004',
                'name' => 'Flour',
                'unit_id' =>  2,
            ],
            [
                'ingredient_code' => 'ING-005',
                'name' => 'Butter',
                'unit_id' => 2,
            ],
        ]);
    }
}
