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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('customer_name')->nullable();
            $table->enum('sales_mode', ['Grab', 'gojek', 'shopee', 'take_away', 'complement', 'delivery']);
            $table->enum('payment_method', ['cash', 'ewallet', 'card']);
            $table->decimal('total_price', 15, 2);
            $table->decimal('discount', 15, 2)->default(0); // Diskon total transaksi
            $table->decimal('final_price', 15, 2); // total_price - discount
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
