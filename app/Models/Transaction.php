<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'sales_mode',
        'payment_method',
        'total_price',
        'discount',
        'final_price',
        'note',
    ];

    protected static function booted()
    {
        static::creating(function ($transaction) {
            $today = now()->format('Ymd');

            $lastNumber = DB::table('transactions')
                ->whereDate('created_at', now()->toDateString())
                ->selectRaw("MAX(CAST(SUBSTRING_INDEX(bill_number, '-', -1) AS UNSIGNED)) as max_num")
                ->value('max_num') ?? 0;

            $nextNumber = (int) $lastNumber + 1;

            $formatted = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
            $transaction->bill_number = 'BILL-' . $today . '-' . $formatted;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
