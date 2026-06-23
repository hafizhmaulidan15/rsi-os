<?php

use App\Models\User;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

test('can list inventory items', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    InventoryItem::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('inventory.items'));

    $response->assertStatus(200);
});

test('can create inventory item', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->post(route('inventory.items.store'), [
        'item_code' => 'CUP-130',
        'name' => 'Cup 130ml',
        'category' => 'packaging',
        'unit' => 'pcs',
        'minimum_stock' => 100,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('inventory.items'));

    $this->assertDatabaseHas('inventory_items', [
        'item_code' => 'CUP-130',
        'name' => 'Cup 130ml',
    ]);
});

test('can create inventory transaction', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $item = InventoryItem::factory()->create();

    $response = $this->actingAs($user)->post(route('inventory.transactions.store'), [
        'item_id' => $item->id,
        'transaction_type' => 'in',
        'quantity' => 50,
        'transaction_date' => now()->format('Y-m-d'),
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('inventory.index', ['tab' => 'all']));

    $this->assertDatabaseHas('inventory_transactions', [
        'item_id' => $item->id,
        'transaction_type' => 'in',
        'quantity' => 50,
    ]);
});

test('inventory stock calculated from transactions', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $item = InventoryItem::factory()->create(['minimum_stock' => 10]);

    $this->actingAs($user)->post(route('inventory.transactions.store'), [
        'item_id' => $item->id,
        'transaction_type' => 'in',
        'quantity' => 100,
        'transaction_date' => now()->format('Y-m-d'),
    ]);

    $this->actingAs($user)->post(route('inventory.transactions.store'), [
        'item_id' => $item->id,
        'transaction_type' => 'out',
        'quantity' => 30,
        'transaction_date' => now()->format('Y-m-d'),
    ]);

    $service = app(App\Services\InventoryService::class);
    $stock = $service->getCurrentStock($item->id);

    expect($stock)->toBe(70.0);
});

test('cannot create transaction without item', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->post(route('inventory.transactions.store'), [
        'transaction_type' => 'in',
        'quantity' => 50,
    ]);

    $response->assertSessionHasErrors('item_id');
});
