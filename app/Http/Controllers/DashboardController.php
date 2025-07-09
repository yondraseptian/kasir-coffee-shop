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

        // Sales this month
        $sales = Transaction::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum('total_price');

        // Total COGS (HPP) this month (sum total penggunaan bahan yang ada used_quantity dan dikaitkan transaksi)
        $cogs = DB::table('ingredient_stock_ins')
            ->whereMonth('updated_at', $month)
            ->whereYear('updated_at', $year)
            ->sum(DB::raw('used_quantity * price_per_unit'));

        // Estimasi COGS dalam persen dari total penjualan
        $cogsPercentage = $sales > 0 ? round(($cogs / $sales) * 100, 2) : 0;

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
        $stockValue = IngredientStockIn::select(DB::raw('SUM((quantity - used_quantity) * price_per_unit) as total'))
            ->value('total');

        // Spoilage rate
        $spoilRate = $stockUsage > 0 ? round(($spoil / $stockUsage) * 100, 2) : 0;

        return Inertia::render('dashboard', [
            'cogs' => $cogsPercentage,
            'stockUsage' => $stockUsage,
            'spoilage' => $spoil,
            'sales' => $sales,
            'totalProducts' => $totalProducts,
            'stockValue' => $stockValue,
            'spoilRate' => $spoilRate,
            'efficiency' => 100 - $spoilRate,
        ]);
    }
}
