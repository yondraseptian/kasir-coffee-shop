<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ingredient_stock_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingredient_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable(); // jika karena penjualan
            $table->foreignId('ingredient_stock_id')->nullable(); // ambil dari mana (FIFO)
            $table->decimal('quantity', 8, 2);
            $table->decimal('cost', 10, 2); // price_per_unit * quantity
            $table->timestamp('used_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_stock_usages');
    }
};
