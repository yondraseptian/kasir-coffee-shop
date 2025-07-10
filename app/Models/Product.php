<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['product_code','name', 'category_id', 'description', 'price', 'image'];
    use HasFactory;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'product_ingredient')
                    ->withPivot(['quantity', 'unit_id'])
                    ->withTimestamps();
    }
}
