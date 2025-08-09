<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientStockIn;
use App\Models\IngredientStockOut;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;

        // Total penjualan bulan ini
        $sales = Transaction::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum('total_price');

        // Total nilai pembelian stok bulan ini
        $stockValueThisMonth = DB::table('ingredient_stock_ins')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum(DB::raw('quantity * price_per_unit'));

        // Total spoil bulan ini
        $spoilThisMonth = IngredientStockOut::where('reason', 'like', '%spoil%')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum(DB::raw('quantity * price_per_unit'));

        // COGS = (Stock This Month - Spoil This Month) / Sales
        $cogsPercentage = $sales > 0
            ? round((($stockValueThisMonth - $spoilThisMonth) / $sales) * 100, 2)
            : 0;
        // Estimasi COGS dalam persen dari total penjualan

        // Stock Usage (Total pemakaian bahan dikalikan harga per unit)
        $stockUsage = DB::table('ingredient_stock_ins')
            ->sum(DB::raw('used_quantity * price_per_unit'));

        // Spoilage (pengurangan stok yang ditandai dengan "spoil" atau sejenisnya)
        $spoil = IngredientStockOut::where('reason', 'like', '%spoil%')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum(DB::raw('quantity * price_per_unit'));

        // Produk total
        $totalProducts = Product::count();

        // Estimasi nilai seluruh stok saat ini
        $stockValue = IngredientStockIn::select(DB::raw('SUM((quantity) * price_per_unit) as total'))
            ->value('total');

        // Spoilage rate
        $spoilRate = $stockUsage > 0 ? round(($spoil / $stockUsage) * 100, 2) : 0;

        $stockUsageDetails = DB::table('ingredient_stock_ins')
            ->join('ingredients', 'ingredient_stock_ins.ingredient_id', '=', 'ingredients.id')
            ->select(
                'ingredients.name as ingredient_name',
                'ingredient_stock_ins.used_quantity',
                'ingredient_stock_ins.price_per_unit',
                DB::raw('(ingredient_stock_ins.used_quantity * ingredient_stock_ins.price_per_unit) as total_usage_cost')
            )
            ->where('ingredient_stock_ins.used_quantity', '>', 0)
            ->whereMonth('ingredient_stock_ins.updated_at', $month)
            ->whereYear('ingredient_stock_ins.updated_at', $year)
            ->orderByDesc('ingredient_stock_ins.updated_at')
            ->get();

        // Stock Value Details (Hanya bulan ini)
        $stockValueDetails = DB::table('ingredient_stock_ins')
            ->join('ingredients', 'ingredient_stock_ins.ingredient_id', '=', 'ingredients.id')
            ->select(
                'ingredient_stock_ins.created_at as date',
                'ingredients.name as ingredient_name',
                'ingredient_stock_ins.quantity',
                'ingredient_stock_ins.used_quantity',
                DB::raw('(ingredient_stock_ins.quantity - ingredient_stock_ins.used_quantity) as difference'),
                'ingredient_stock_ins.price_per_unit',
                DB::raw('(ingredient_stock_ins.quantity * ingredient_stock_ins.price_per_unit) as total_value'),
                DB::raw('((ingredient_stock_ins.quantity - ingredient_stock_ins.used_quantity) * ingredient_stock_ins.price_per_unit) as remaining_value')
            )
            ->where('ingredient_stock_ins.quantity', '>', 0)
            ->whereMonth('ingredient_stock_ins.created_at', $month)
            ->whereYear('ingredient_stock_ins.created_at', $year)
            ->orderByDesc('ingredient_stock_ins.created_at')
            ->get();

        $ingredients = Ingredient::with('stockIns', 'stockOuts')
            ->get()
            ->map(function ($ingredient) {
                return [
                    'name' => $ingredient->name,
                    'stock_in' => $ingredient->stockIns->sum('quantity'),
                    'final_stock' => $ingredient->final_stock,
                    'stock_alert_threshold' => $ingredient->stock_alert_threshold,
                    'is_below_threshold' => $ingredient->final_stock <= $ingredient->stock_alert_threshold,
                ];
            });

        return Inertia::render('dashboard', [
            'cogs' => $cogsPercentage,
            'stockUsage' => $stockUsage,
            'spoilage' => $spoil,
            'sales' => $sales,
            'totalProducts' => $totalProducts,
            'stockValue' => $stockValue,
            'spoilRate' => $spoilRate,
            'efficiency' => 100 - $spoilRate,
            'stockUsageDetails' => $stockUsageDetails,
            'stockValueDetails' => $stockValueDetails,
            'ingredientStockAlerts' => $ingredients
        ]);
    }
}
