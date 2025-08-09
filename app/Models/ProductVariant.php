<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'size', 'temperature', 'price'];
    use HasFactory;
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
