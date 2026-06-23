<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            ['supplier_code' => 'SUP-001', 'name' => 'Peternakan Sapi Perah Ciamis', 'phone' => '081234567890', 'address' => 'Ciamis, Jawa Barat'],
            ['supplier_code' => 'SUP-002', 'name' => 'KUD Tani Mulya', 'phone' => '081234567891', 'address' => 'Tasikmalaya, Jawa Barat'],
            ['supplier_code' => 'SUP-003', 'name' => 'Peternakan Sapi Lembang', 'phone' => '081234567892', 'address' => 'Lembang, Jawa Barat'],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(['supplier_code' => $supplier['supplier_code']], $supplier);
        }
    }
}
