<?php

namespace App\Exports;

use App\Models\Product;
use App\Models\Unit;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // Load data + relasi pivot
        $units = Unit::all()->keyBy('id'); // untuk ambil nama unit dari unit_id
        return Product::with(['category', 'ingredients'])->get()->map(function ($product) use ($units) {
            $ingredientList = $product->ingredients->map(function ($ingredient) use ($units) {
                $unitName = $units[$ingredient->pivot->unit_id]->name ?? '';
                return $ingredient->name . ' (' . $ingredient->pivot->quantity . ' ' . $unitName . ')';
            })->join(', ');

            return [
                'Product Code' => $product->product_code,
                'Name' => $product->name,
                'Price' => $product->price,
                'Category' => $product->category->name ?? '-',
                'Image' => $product->image,
                'Ingredients' => $ingredientList,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Product Code',
            'Name',
            'Price',
            'Category',
            'Image',
            'Ingredients',
        ];
    }
}
