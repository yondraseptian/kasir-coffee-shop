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
        Schema::create('unit_conversions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ingredient_id')->nullable()->constrained()->nullOnDelete(); // bisa null jika global
            $table->unsignedBigInteger('from_unit_id');
            $table->unsignedBigInteger('to_unit_id');
            $table->decimal('multiplier', 10, 4); // Misal: 1 sendok = 12 gram → multiplier = 12
            $table->timestamps();

            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
            $table->foreign('from_unit_id')->references('id')->on('units')->onDelete('cascade');
            $table->foreign('to_unit_id')->references('id')->on('units')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_conversions');
    }
};
