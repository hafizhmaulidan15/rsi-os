<?php

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Services\InventoryService;

test('getCurrentStock returns sum of in minus out', function () {
    $item = InventoryItem::factory()->create();

    InventoryTransaction::create([
        'item_id' => $item->id,
        'transaction_type' => 'in',
        'quantity' => 100,
        'transaction_date' => now(),
    ]);
    InventoryTransaction::create([
        'item_id' => $item->id,
        'transaction_type' => 'out',
        'quantity' => -30,
        'transaction_date' => now(),
    ]);

    $service = app(InventoryService::class);
    $stock = $service->getCurrentStock($item->id);

    expect($stock)->toBe(70.0);
});

test('getCurrentStock returns zero with no transactions', function () {
    $item = InventoryItem::factory()->create();

    $service = app(InventoryService::class);
    $stock = $service->getCurrentStock($item->id);

    expect($stock)->toBe(0.0);
});

test('getAllStock returns status out_of_stock when zero', function () {
    $item = InventoryItem::factory()->create(['minimum_stock' => 10]);

    $service = app(InventoryService::class);
    $allStock = $service->getAllStock();

    $found = collect($allStock)->firstWhere('id', $item->id);
    expect($found['status'])->toBe('out_of_stock');
    expect($found['stock'])->toBe(0.0);
});
