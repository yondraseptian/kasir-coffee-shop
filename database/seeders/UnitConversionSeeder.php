<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitConversionSeeder extends Seeder
{
    public function run(): void
    {
        // Get unit ids
        $gram = DB::table('units')->where('abbreviation', 'g')->first();
        $kg = DB::table('units')->where('abbreviation', 'kg')->first();
        $ml = DB::table('units')->where('abbreviation', 'ml')->first();
        $liter = DB::table('units')->where('abbreviation', 'l')->first();

        DB::table('unit_conversions')->insert([
            // 1 kg = 1000 g
            [
                'from_unit_id' => $kg->id,
                'to_unit_id' => $gram->id,
                'multiplier' => 1000,
            ],
            // 1 liter = 1000 ml
            [
                'from_unit_id' => $liter->id,
                'to_unit_id' => $ml->id,
                'multiplier' => 1000,
            ],
            // 1 g = 0.001 kg
            [
                'from_unit_id' => $gram->id,
                'to_unit_id' => $kg->id,
                'multiplier' => 0.001,
            ],
            // 1 ml = 0.001 liter
            [
                'from_unit_id' => $ml->id,
                'to_unit_id' => $liter->id,
                'multiplier' => 0.001,
            ],
        ]);
    }
}

