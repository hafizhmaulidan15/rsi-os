<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Hafizh',
            'email' => 'hafizh@rumahsusu.id',
        ]);

        $this->call([
            SupplierSeeder::class,
            InventoryItemSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
