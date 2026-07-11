<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Http\Requests\StoreInventoryTransactionRequest;
use App\Services\InventoryService;

class InventoryController extends Controller
{
    public function __construct(private InventoryService $inventoryService) {}
    
    public function index() {
        $items = InventoryItem::where('is_active', true)->get();
        return $items->map(fn($item) => [
            'id' => $item->id,
            'name' => $item->name,
            'category' => $item->category,
            'unit' => $item->unit,
            'stock' => $this->inventoryService->getCurrentStock($item->id),
            'minimum_stock' => $item->minimum_stock,
        ]);
    }
    
    public function items() { return InventoryItem::where('is_active', true)->paginate(20); }
    
    public function storeTransaction(StoreInventoryTransactionRequest $request) {
        return InventoryTransaction::create($request->validated());
    }
}
