<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitConversion extends Model
{
    protected $fillable = [
        'ingredient_id',
        'from_unit_id',
        'to_unit_id',
        'multiplier',
    ];

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function fromUnit()
    {
        return $this->belongsTo(Unit::class, 'from_unit_id');
    }

    public function toUnit()
    {
        return $this->belongsTo(Unit::class, 'to_unit_id');
    }
}
