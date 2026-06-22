<?php

use App\Models\MilkBatch;
use App\Services\BatchNumberService;

test('generates RM batch number format', function () {
    $service = app(BatchNumberService::class);
    $number = $service->generate('RM');

    expect($number)->toMatch('/^RM-\d{8}-\d{3}$/');
    expect($number)->toStartWith('RM-' . now()->format('Ymd') . '-');
});

test('generates MZ batch number format', function () {
    $service = app(BatchNumberService::class);
    $number = $service->generate('MZ');

    expect($number)->toMatch('/^MZ-\d{8}-\d{3}$/');
});

test('generates SC batch number format', function () {
    $service = app(BatchNumberService::class);
    $number = $service->generate('SC');

    expect($number)->toMatch('/^SC-\d{8}-\d{3}$/');
});

test('batch numbers increment', function () {
    $service = app(BatchNumberService::class);
    $first = $service->generate('RM');

    MilkBatch::factory()->create(['batch_number' => $first]);

    $second = $service->generate('RM');
    $firstSeq = substr($first, -3);
    $secondSeq = substr($second, -3);

    expect((int) $secondSeq)->toBe((int) $firstSeq + 1);
});
