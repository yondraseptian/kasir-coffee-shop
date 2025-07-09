<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductIngredient extends Model
{
    protected $table = 'product_ingredient';

    protected $fillable = [
        'product_id',
        'ingredient_id',
        'quantity',
        'unit_id',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
