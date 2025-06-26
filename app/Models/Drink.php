<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drink extends Model
{
    protected $fillable = ['name', 'price', 'type'];

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
