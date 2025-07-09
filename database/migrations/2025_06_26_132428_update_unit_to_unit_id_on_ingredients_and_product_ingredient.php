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
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropColumn('unit');
            $table->foreignId('unit_id')->nullable()->after('name')->constrained('units')->onDelete('cascade');
        });

        Schema::table('product_ingredient', function (Blueprint $table) {
            $table->dropColumn('unit');
            $table->foreignId('unit_id')->nullable()->after('quantity')->constrained('units')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('unit_id_on_ingredients_and_product_ingredient', function (Blueprint $table) {
            //
        });
    }
};
