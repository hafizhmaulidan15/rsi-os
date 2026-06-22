<?php

use App\Services\YieldEngine;

test('predict yield calculates correctly', function () {
    $engine = app(YieldEngine::class);
    $predicted = $engine->predict(500, 11.5, 0.12);

    expect($predicted)->toBe(6.9);
});

test('predict yield with custom factor', function () {
    $engine = app(YieldEngine::class);
    $predicted = $engine->predict(1000, 12.0, 0.10);

    expect($predicted)->toBe(12.0);
});

test('calculate variance positive', function () {
    $engine = app(YieldEngine::class);
    $variance = $engine->calculateVariance(10.0, 11.0);

    expect($variance)->toBe(10.0);
});

test('calculate variance negative', function () {
    $engine = app(YieldEngine::class);
    $variance = $engine->calculateVariance(10.0, 9.0);

    expect($variance)->toBe(-10.0);
});

test('calculate variance zero when predicted is zero', function () {
    $engine = app(YieldEngine::class);
    $variance = $engine->calculateVariance(0, 5.0);

    expect($variance)->toBe(0.0);
});
