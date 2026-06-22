<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function getCurrentStock(int $itemId): float
    {
        return (float) InventoryTransaction::where('item_id', $itemId)
            ->sum('quantity');
    }

    public function getAllStock(): array
    {
        return InventoryItem::where('is_active', true)->get()->map(function ($item) {
            $stock = $this->getCurrentStock($item->id);
            return [
                'id' => $item->id,
                'item_code' => $item->item_code,
                'name' => $item->name,
                'category' => $item->category,
                'unit' => $item->unit,
                'stock' => $stock,
                'minimum_stock' => $item->minimum_stock,
                'status' => $stock <= 0 ? 'out_of_stock' : ($stock <= $item->minimum_stock ? 'low' : 'ok'),
            ];
        })->toArray();
    }
}
