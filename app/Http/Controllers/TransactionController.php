<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function index()
    {
        // Ambil semua transaksi beserta detail dan produk dari setiap detail
        $transactions = Transaction::with(['user', 'transactionDetails.product'])
            ->get()
            ->map(function ($transaction) {
                return [
                    'transaction_id' => $transaction->id,
                    'user_name' => $transaction->user->name,
                    'details' => $transaction->transactionDetails->map(function ($detail) {
                        return [
                            'product_name' => $detail->product->name,
                            'quantity' => $detail->quantity,
                            'price' => $detail->product->price,
                            'total_price' => $detail->quantity * $detail->product->price,
                        ];
                    }),
                ];
            });

        return inertia('transactions/transactions', [
            'transactions' => $transactions,
        ]);
    }

    public function details($id)
    {
        $transaction = Transaction::with(['user', 'transactionDetails.product'])->findOrFail($id);

        return inertia('transactions/transaction-view', [
            'transaction' => [
                'id' => $transaction->id,
                'user_name' => $transaction->user->name,
                'payment_method' => $transaction->payment_method,
                'total_price' => $transaction->total_price,
                'created_at' => $transaction->created_at,
                'details' => $transaction->transactionDetails->map(function ($detail) {
                    return [
                        'product_name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->product->price,
                        'total_price' => $detail->quantity * $detail->product->price,
                    ];
                }),
            ],
        ]);
    }


    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'total_price' => $request->total,
                'payment_method' => 'cash', // atau sesuai kebutuhan
            ]);

            foreach ($request->products as $product) {
                $transaction->transactionDetails()->create([
                    'product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'total_price' => $product['price'],
                ]);

                // Otomatis kurangi stok bahan berdasarkan produk
                StockService::consumeIngredients($product['id'], $product['quantity']);
            }
        });

        return redirect()->back()->with('success', 'Transaksi berhasil!');
    }
}
