<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function fromUnitConversions()
    {
        return $this->hasMany(UnitConversion::class, 'from_unit_id');
    }

    public function toUnitConversions()
    {
        return $this->hasMany(UnitConversion::class, 'to_unit_id');
    }
}
