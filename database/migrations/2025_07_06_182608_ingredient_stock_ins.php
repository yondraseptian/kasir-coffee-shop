<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ingredient_stock_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingredient_id')->constrained();
            $table->foreignId('unit_id')->constrained('units'); // Satuan pada saat pembelian
            $table->decimal('quantity', 10, 2);
            $table->decimal('price_per_unit', 10, 2);
            $table->decimal('total_price', 12, 2);
            $table->decimal('used_quantity', 10, 2)->default(0);
            $table->date('expired_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_stock_ins');
    }
};
