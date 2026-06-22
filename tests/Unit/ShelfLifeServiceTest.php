<?php

use App\Services\ShelfLifeService;

test('shelf life calculates expiry date', function () {
    $service = app(ShelfLifeService::class);
    $result = $service->calculate('2026-06-21', '08:00', 14);

    expect($result['expiry_date'])->toBe('2026-07-05');
    expect($result['shelf_life_days'])->toBe(14);
});

test('shelf life with custom days', function () {
    $service = app(ShelfLifeService::class);
    $result = $service->calculate('2026-06-21', '08:00', 7);

    expect($result['expiry_date'])->toBe('2026-06-28');
    expect($result['shelf_life_days'])->toBe(7);
});

test('shelf life remaining days is zero for expired', function () {
    $service = app(ShelfLifeService::class);
    $result = $service->calculate('2026-01-01', '08:00', 7);

    expect($result['remaining_days'])->toBe(0);
});
