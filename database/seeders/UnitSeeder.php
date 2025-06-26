<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('units')->insert([
            ['name' => 'gram', 'abbreviation' => 'g'],
            ['name' => 'kilogram', 'abbreviation' => 'kg'],
            ['name' => 'milliliter', 'abbreviation' => 'ml'],
            ['name' => 'liter', 'abbreviation' => 'l'],
            ['name' => 'piece', 'abbreviation' => 'pcs'],
        ]);
    }
}
