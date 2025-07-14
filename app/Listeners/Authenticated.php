<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Session;

class Authenticated
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Authenticated $event): void
    {
        $user = $event->user;

        // Simpan rute redirect ke dalam session (bisa dibaca oleh controller setelah login)
        if ($user->role === 'admin') {
            Session::put('redirect_after_login', route('dashboard'));
        } elseif ($user->role === 'cashier') {
            Session::put('redirect_after_login', route('cashier'));
        }
    }
}
