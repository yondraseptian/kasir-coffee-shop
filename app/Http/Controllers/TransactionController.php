<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
                    'bill_number' => $transaction->bill_number,
                    'user_name' => $transaction->user->name,
                    'details' => $transaction->transactionDetails->map(function ($detail) {
                        return [
                            'product_name' => $detail->product->name,
                            'quantity' => $detail->quantity,
                            'price' => $detail->unit_price,
                            'total_price' => $detail->quantity * $detail->unit_price,
                        ];
                    }),
                ];
            });

        return inertia('transactions/transactions', [
            'transactions' => $transactions,
        ]);
        // return dd($transactions);
    }

    public function details($id)
    {
        $transaction = Transaction::with(['user', 'transactionDetails.product'])->findOrFail($id);

        return inertia('transactions/transaction-view', [
            'transaction' => [
                'id' => $transaction->id,
                'bill_number' => $transaction->bill_number,
                'user_name' => $transaction->user->name,
                'customer_name' => $transaction->customer_name,
                'payment_method' => $transaction->payment_method,
                'total_price' => $transaction->total_price,
                'created_at' => $transaction->created_at,
                'details' => $transaction->transactionDetails->map(function ($detail) {
                    return [
                        'product_name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->unit_price,
                        'total_price' => $detail->quantity * $detail->unit_price,
                    ];
                }),
            ],
        ]);
    }


    public function store(Request $request)
    {
        try {
            $transaction = DB::transaction(function () use ($request) {
                // Buat transaksi, bill_number akan otomatis terisi oleh model
                $transaction = Transaction::create([
                    'user_id' => auth()->id(),
                    'customer_name' => $request->customer_name,
                    'sales_mode' => $request->sales_mode,
                    'payment_method' => $request->payment_method,
                    'total_price' => $request->total_price,
                    'discount' => $request->discount ?? 0,
                    'final_price' => $request->final_price,
                    'note' => $request->note,
                ]);

                foreach ($request->products as $product) {
                    $transaction->transactionDetails()->create([
                        'product_id' => $product['id'],
                        'product_name' => $product['name'],
                        'size' => $product['size'] ?? null,
                        'temperature' => $product['temperature'] ?? null,
                        'unit_price' => $product['price'],
                        'quantity' => $product['quantity'],
                        'subtotal' => $product['price'] * $product['quantity'],
                    ]);

                    // Kurangi stok bahan baku
                    StockService::consumeIngredients($product['id'], $product['quantity']);
                }

                return $transaction;
            });

            $queueNum = $request->query('queue');

            // Redirect ke halaman cetak struk
            return redirect()->to("/cashier/{$transaction->id}/receipt?queue={$queueNum}");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function showReceipt(Transaction $transaction, Request $request)
    {
        $transaction = Transaction::with(['user', 'transactionDetails.product'])->findOrFail($transaction->id);
        return Inertia::render('receiptPage', [
            'transaction' => [
                'billNum' => $transaction->bill_number,
                'queueNum' => $request->query('queue'),
                'cashier' => $transaction->user->name,
                'member' => $transaction->customer_name,
                'salesMode' => $transaction->payment_method,
                'createdAt' => $transaction->created_at->format('Y-m-d H:i:s'),
                'total' => $transaction->total_price,
                'items' => $transaction->transactionDetails->map(function ($detail) {
                    return [
                        'name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'price' => $detail->unit_price,
                        'subtotal' => $detail->quantity * $detail->unit_price,
                        'variant' => trim(($detail->size ?? '') . ' ' . ($detail->temperature ?? '')),
                    ];
                }),
            ],
        ]);
    }
}
