<?php

use App\Models\User;
use App\Models\Supplier;
use App\Models\MilkBatch;
use App\Models\QcResult;

test('can list qc results', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('qc.index'));

    $response->assertStatus(200);
});

beforeEach(function () {
    \App\Models\Setting::factory()->create(['key' => 'qc_ts_min', 'value' => '11.0', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_protein_min', 'value' => '2.8', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_fat_min', 'value' => '3.0', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_ph_min', 'value' => '6.4', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_ph_max', 'value' => '6.8', 'group' => 'qc']);
});

test('can create a qc result', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch = MilkBatch::factory()->create([
        'supplier_id' => $supplier->id,
        'status' => 'pending_qc',
    ]);

    $response = $this->actingAs($user)->post(route('qc.store'), [
        'milk_batch_id' => $milkBatch->id,
        'qc_type' => 'raw',
        'fat' => 3.5,
        'protein' => 2.9,
        'total_solids' => 11.5,
        'ph' => 6.6,
        'peroxide' => 'negative',
        'antibiotic' => 'negative',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('qc.index'));

    $this->assertDatabaseHas('qc_results', [
        'milk_batch_id' => $milkBatch->id,
        'result' => 'pass',
    ]);
});

test('antibiotic positive causes rejection', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch = MilkBatch::factory()->create([
        'supplier_id' => $supplier->id,
        'status' => 'pending_qc',
    ]);

    $response = $this->actingAs($user)->post(route('qc.store'), [
        'milk_batch_id' => $milkBatch->id,
        'qc_type' => 'raw',
        'fat' => 3.5,
        'protein' => 2.9,
        'total_solids' => 11.5,
        'ph' => 6.6,
        'peroxide' => 'negative',
        'antibiotic' => 'positive',
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('qc_results', [
        'milk_batch_id' => $milkBatch->id,
        'result' => 'reject',
    ]);

    $this->assertDatabaseHas('milk_batches', [
        'id' => $milkBatch->id,
        'status' => 'rejected',
    ]);
});

test('peroxide positive causes rejection', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();
    $milkBatch = MilkBatch::factory()->create([
        'supplier_id' => $supplier->id,
        'status' => 'pending_qc',
    ]);

    $response = $this->actingAs($user)->post(route('qc.store'), [
        'milk_batch_id' => $milkBatch->id,
        'qc_type' => 'raw',
        'fat' => 3.5,
        'protein' => 2.9,
        'total_solids' => 11.5,
        'ph' => 6.6,
        'peroxide' => 'positive',
        'antibiotic' => 'negative',
    ]);

    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('qc_results', [
        'milk_batch_id' => $milkBatch->id,
        'result' => 'reject',
    ]);

    $this->assertDatabaseHas('milk_batches', [
        'id' => $milkBatch->id,
        'status' => 'rejected',
    ]);
});
