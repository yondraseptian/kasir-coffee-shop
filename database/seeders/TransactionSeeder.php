<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();

        $method = ['cash', 'qr', 'debit'];

        if ($products->count() === 0 || $users->count() === 0) {
            $this->command->info('Tidak ada produk atau user untuk membuat transaksi.');
            return;
        }

        foreach (range(1, 10) as $i) {
            $user = $users->random();

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total_price' => 0, // akan diupdate setelah detail dimasukkan
                'payment_method' => $method[array_rand($method)],
            ]);

            $selectedProducts = $products->random(rand(1, 5));
            $totalTransactionPrice = 0;

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 3);
                $totalPrice = $product->price * $quantity;

                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'total_price' => $totalPrice,
                ]);

                $totalTransactionPrice += $totalPrice;
            }

            // Update total_price transaksi
            $transaction->update([
                'total_price' => $totalTransactionPrice,
            ]);
        }
    }
}
