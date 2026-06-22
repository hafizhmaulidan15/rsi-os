<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'hafizh@rsi.com'],
            [
                'name' => 'Hafizh',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            SupplierSeeder::class,
            InventoryItemSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
