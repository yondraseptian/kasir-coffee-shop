<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngredientStockOut extends Model
{

    protected $fillable = [
        'ingredient_id', 'quantity', 'unit_id','price_per_unit','cost', 'reason'
    ];
    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
