<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit_id',
        'is_out_of_stock',
        'stock_alert_threshold'
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

    public function stockIns()
    {
        return $this->hasMany(IngredientStockIn::class);
    }

    public function stockOuts()
    {
        return $this->hasMany(IngredientStockOut::class);
    }

    // public function stockUsages()
    // {
    //     return $this->hasMany(IngredientStockUsage::class);
    // }

    public function getFinalStockAttribute(): float
    {
        $in = $this->stockIns()->sum('quantity');
        $out = $this->stockOuts()->sum('quantity');
        $used = $this->stockIns()->sum('used_quantity');

        return $in - $out - $used;
    }
}
