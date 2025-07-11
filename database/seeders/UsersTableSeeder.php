<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'JohnDoe@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ],
        ]);
        DB::table('users')->insert([
            [
                'name' => 'kasir',
                'email' => 'kasir@example.com',
                'password' => bcrypt('password'),
                'role' => 'cashier'
            ],
        ]);
    }
}
