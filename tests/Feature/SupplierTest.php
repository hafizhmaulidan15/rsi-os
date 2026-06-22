<?php

use App\Models\User;
use App\Models\Supplier;

test('can list suppliers', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    Supplier::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('suppliers.index'));

    $response->assertStatus(200);
});

test('can create a supplier with valid data', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->post(route('suppliers.store'), [
        'supplier_code' => 'SUP-001',
        'name' => 'PT Susu Sejahtera',
        'phone' => '08123456789',
        'address' => 'Jl. Susu No. 1',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('suppliers.index'));

    $this->assertDatabaseHas('suppliers', [
        'supplier_code' => 'SUP-001',
        'name' => 'PT Susu Sejahtera',
    ]);
});

test('cannot create a supplier without name', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->post(route('suppliers.store'), [
        'supplier_code' => 'SUP-002',
    ]);

    $response->assertSessionHasErrors('name');
});

test('can edit a supplier', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($user)->put(route('suppliers.update', $supplier), [
        'supplier_code' => $supplier->supplier_code,
        'name' => 'Updated Supplier Name',
        'phone' => '08987654321',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('suppliers.index'));

    $this->assertDatabaseHas('suppliers', [
        'id' => $supplier->id,
        'name' => 'Updated Supplier Name',
    ]);
});

test('can delete a supplier', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($user)->delete(route('suppliers.destroy', $supplier));

    $response->assertRedirect(route('suppliers.index'));
    $this->assertDatabaseMissing('suppliers', ['id' => $supplier->id]);
});
