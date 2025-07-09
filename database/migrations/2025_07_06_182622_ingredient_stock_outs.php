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
        Schema::create('ingredient_stock_outs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingredient_id')->constrained()->onDelete('cascade');
            $table->foreignId('unit_id')->constrained('units')->onDelete('cascade');
            $table->decimal('quantity', 10, 2);
            $table->decimal('price_per_unit', 10, 2); // Harga per unit saat stock keluar
            $table->decimal('cost', 12, 2); // quantity * price_per_unit
            $table->text('reason')->nullable(); // Contoh: "Basi", "Kadaluarsa", "Habis dipakai"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_stock_outs');
    }
};
