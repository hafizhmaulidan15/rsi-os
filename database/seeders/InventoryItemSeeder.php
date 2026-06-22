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
            ['item_code' => 'PKG-CUP130', 'name' => 'Cup 130ml', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 200],
            ['item_code' => 'PKG-CUP175', 'name' => 'Cup 175ml', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 200],
            ['item_code' => 'PKG-ROLL2', 'name' => 'Roll 2 Line', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10],
            ['item_code' => 'PKG-ROLL4', 'name' => 'Roll 4 Line', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 10],
            ['item_code' => 'PKG-BOX', 'name' => 'Box', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 20],
            ['item_code' => 'PKG-TRAY', 'name' => 'Tray', 'category' => 'packaging', 'unit' => 'pcs', 'minimum_stock' => 20],
        ];

        foreach ($items as $item) {
            InventoryItem::create($item);
        }
    }
}
