<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['item_code' => 'MOZZA-001', 'name' => 'Mozzarella Fresh', 'category' => 'mozzarella', 'unit' => 'kg', 'minimum_stock' => 5],
            ['item_code' => 'CUP130-001', 'name' => 'Susu Cup 130ml', 'category' => 'susu_cup', 'unit' => 'pcs', 'minimum_stock' => 50],
            ['item_code' => 'CUP175-001', 'name' => 'Susu Cup 175ml', 'category' => 'susu_cup', 'unit' => 'pcs', 'minimum_stock' => 50],
            ['item_code' => 'PKG-CUP130', 'name' => 'Cup 130ml (kosong)', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10000],
            ['item_code' => 'PKG-CUP175', 'name' => 'Cup 175ml (kosong)', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 5000],
            ['item_code' => 'PLG-2L', 'name' => 'Plastik Logo 2 Line', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 5],
            ['item_code' => 'PLG-4L', 'name' => 'Plastik Logo 4 Line', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 5],
            ['item_code' => 'PLG-RL', 'name' => 'Plastik Roll Logo', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10],
            ['item_code' => 'PLG-RP', 'name' => 'Plastik Roll Polos', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 2],
            ['item_code' => 'BOX-01', 'name' => 'Box Tasik', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10],
            ['item_code' => 'TRAY-01', 'name' => 'Tray Tasik', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10],
        ];

        foreach ($items as $item) {
            InventoryItem::updateOrCreate(['item_code' => $item['item_code']], $item);
        }
    }
}
