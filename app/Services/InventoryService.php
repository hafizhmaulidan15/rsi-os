<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

class InventoryService
{
    public function getCurrentStock(int $itemId): float
    {
        return (float) InventoryTransaction::where('item_id', $itemId)
            ->sum('quantity');
    }

    public function getStockHealth(float $stock, float $minimumStock): string
    {
        if ($stock <= 0) return 'out_of_stock';
        if ($stock <= $minimumStock) return 'low';
        if ($stock <= $minimumStock * 2) return 'medium';
        return 'ok';
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
                'minimum_stock' => (float) $item->minimum_stock,
                'health' => $this->getStockHealth($stock, (float) $item->minimum_stock),
            ];
        })->toArray();
    }

    public function getTransactionsWithRunningBalance(int $itemId): array
    {
        $transactions = InventoryTransaction::where('item_id', $itemId)
            ->orderBy('transaction_date')
            ->orderBy('created_at')
            ->get();

        $balance = 0;
        return $transactions->map(function ($t) use (&$balance) {
            $balance += (float) $t->quantity;
            $t->running_balance = $balance;
            return $t;
        })->reverse()->values()->toArray();
    }
}
