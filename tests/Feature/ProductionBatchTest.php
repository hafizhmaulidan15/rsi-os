<?php

use App\Models\User;
use App\Models\Supplier;
use App\Models\MilkBatch;
use App\Models\ProductionBatch;

test('can list production batches', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('production.index'));

    $response->assertStatus(200);
});

test('can create mozzarella batch', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch = MilkBatch::factory()->create([
        'supplier_id' => $supplier->id,
        'status' => 'approved',
    ]);

    $response = $this->actingAs($user)->post(route('production.store'), [
        'milk_batch_id' => $milkBatch->id,
        'production_type' => 'mozzarella',
        'start_time' => now()->format('Y-m-d H:i:s'),
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('production_batches', [
        'milk_batch_id' => $milkBatch->id,
        'production_type' => 'mozzarella',
    ]);

    $batch = ProductionBatch::where('milk_batch_id', $milkBatch->id)->first();
    expect($batch->batch_number)->toStartWith('MZ-' . now()->format('Ymd') . '-');
    expect($batch->batch_number)->toMatch('/^MZ-\d{8}-\d{3}$/');
});

test('can create susu cup batch', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch = MilkBatch::factory()->create([
        'supplier_id' => $supplier->id,
        'status' => 'approved',
    ]);

    $response = $this->actingAs($user)->post(route('production.store'), [
        'milk_batch_id' => $milkBatch->id,
        'production_type' => 'susu_cup',
        'start_time' => now()->format('Y-m-d H:i:s'),
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('production_batches', [
        'milk_batch_id' => $milkBatch->id,
        'production_type' => 'susu_cup',
    ]);

    $batch = ProductionBatch::where('milk_batch_id', $milkBatch->id)->first();
    expect($batch->batch_number)->toStartWith('SC-' . now()->format('Ymd') . '-');
    expect($batch->batch_number)->toMatch('/^SC-\d{8}-\d{3}$/');
});

test('batch number formats differ for mozzarella and susu cup', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch1 = MilkBatch::factory()->create(['supplier_id' => $supplier->id, 'status' => 'approved']);
    $milkBatch2 = MilkBatch::factory()->create(['supplier_id' => $supplier->id, 'status' => 'approved']);

    $this->actingAs($user)->post(route('production.store'), [
        'milk_batch_id' => $milkBatch1->id,
        'production_type' => 'mozzarella',
        'start_time' => now()->format('Y-m-d H:i:s'),
    ]);

    $this->actingAs($user)->post(route('production.store'), [
        'milk_batch_id' => $milkBatch2->id,
        'production_type' => 'susu_cup',
        'start_time' => now()->format('Y-m-d H:i:s'),
    ]);

    $mozzarellaBatch = ProductionBatch::where('milk_batch_id', $milkBatch1->id)->first();
    $susuCupBatch = ProductionBatch::where('milk_batch_id', $milkBatch2->id)->first();

    expect($mozzarellaBatch->batch_number)->toStartWith('MZ-');
    expect($susuCupBatch->batch_number)->toStartWith('SC-');
});
