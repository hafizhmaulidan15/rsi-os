<?php

use App\Models\User;
use App\Models\ProductionBatch;
use App\Models\ShelfLifeRecord;

test('can list shelf life records', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('shelf-life.index'));

    $response->assertStatus(200);
});

test('shelf life service calculates correctly', function () {
    $service = app(App\Services\ShelfLifeService::class);

    $result = $service->calculate('2026-06-21', '08:00', 14);

    expect($result)->toHaveKeys(['shelf_life_days', 'expiry_date', 'remaining_days']);
    expect($result['shelf_life_days'])->toBe(14);
    expect($result['expiry_date'])->toBe('2026-07-05');
});
