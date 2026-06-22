<?php

use App\Models\User;
use App\Models\Supplier;
use App\Models\MilkBatch;

test('can list milk batches', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    MilkBatch::factory()->count(3)->create(['supplier_id' => $supplier->id]);

    $response = $this->actingAs($user)->get(route('milk-batches.index'));

    $response->assertStatus(200);
});

test('can create a milk batch with valid data', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($user)->post(route('milk-batches.store'), [
        'supplier_id' => $supplier->id,
        'received_date' => now()->format('Y-m-d'),
        'received_time' => '08:00',
        'volume_liter' => 500.50,
        'production_target' => 'mozzarella',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('milk_batches', [
        'supplier_id' => $supplier->id,
        'volume_liter' => 500.50,
    ]);
});

test('cannot create milk batch without supplier', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->post(route('milk-batches.store'), [
        'received_date' => now()->format('Y-m-d'),
        'received_time' => '08:00',
        'volume_liter' => 100,
        'production_target' => 'susu_cup',
    ]);

    $response->assertSessionHasErrors('supplier_id');
});

test('batch number auto-generated format RM-YYYYMMDD-001', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();

    $this->actingAs($user)->post(route('milk-batches.store'), [
        'supplier_id' => $supplier->id,
        'received_date' => now()->format('Y-m-d'),
        'received_time' => '08:00',
        'volume_liter' => 200,
        'production_target' => 'mozzarella',
    ]);

    $batch = MilkBatch::first();

    $expectedPrefix = 'RM-' . now()->format('Ymd') . '-';
    expect($batch->batch_number)->toStartWith($expectedPrefix);
    expect($batch->batch_number)->toMatch('/^RM-\d{8}-\d{3}$/');
});
