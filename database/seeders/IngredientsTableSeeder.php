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
                'unit_id' => 2
            ],
            [
                'name' => 'Milk',
                'unit_id' => 4,
            ],
            [
                'name' => 'Sugar',
                'unit_id' => 2,
            ],
            [
                'name' => 'Flour',
                'unit_id' =>  2,
            ],
            [
                'name' => 'Butter',
                'unit_id' => 2,
            ],
        ]);
    }
}
