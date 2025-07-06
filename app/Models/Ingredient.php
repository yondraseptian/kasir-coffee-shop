<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit_id',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_ingredient')
            ->withPivot('quantity', 'unit_id')
            ->using(ProductIngredient::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
