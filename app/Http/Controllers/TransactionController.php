<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(){
        return Transaction::with('transactionDetails.drink')->get();
    }

    public function store(Request $request){
        $transaction = Transaction::create (request()->only([
            'user_id',
            'total_price',
        ]));

        foreach($request->transactionDetails as $transactionDetail){
            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'drink_id' => $transactionDetail['drink_id'],
                'quantity' => $transactionDetail['quantity'],
                'total_price' => $transactionDetail['total_price'],
            ]);
        }

        return response()->json($transaction, 201);
    }
}
