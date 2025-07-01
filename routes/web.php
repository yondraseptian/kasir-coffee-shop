<?php

use App\Http\Controllers\CashierController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('products', [ProductController::class, 'index'])->name('products');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');  
    Route::post('categories', [ProductController::class, 'storeCategory'])->name('categories.store');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    Route::get('ingredients', [IngredientController::class, 'index'])->name('ingredients');
    Route::get('/ingredients/create', [IngredientController::class, 'create'])->name('ingredients.create');
    Route::post('/ingredients', [IngredientController::class, 'store'])->name('ingredients.store');
    Route::get('/ingredients/{id}/edit', [IngredientController::class, 'edit'])->name('ingredients.edit');
    Route::put('/ingredients/{id}', [IngredientController::class, 'update'])->name('ingredients.update');
    Route::delete('/ingredients/{id}', [IngredientController::class, 'destroy'])->name('ingredients.destroy');

    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions');
    Route::get('transactions/{id}', [TransactionController::class, 'details'])->name('transactions.details');

    Route::get('cashier', [CashierController::class, 'index'])->name('cashier');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
