<?php

use App\Services\QCEngine;

beforeEach(function () {
    \App\Models\Setting::factory()->create(['key' => 'qc_ts_min', 'value' => '11.0', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_protein_min', 'value' => '2.8', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_fat_min', 'value' => '3.0', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_ph_min', 'value' => '6.4', 'group' => 'qc']);
    \App\Models\Setting::factory()->create(['key' => 'qc_ph_max', 'value' => '6.8', 'group' => 'qc']);
});

test('antibiotic positive causes reject', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate(['antibiotic' => 'positive']);

    expect($result['result'])->toBe('reject');
    expect($result['warnings'])->toContain('Antibiotic Positive');
});

test('peroxide positive causes reject', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate(['peroxide' => 'positive']);

    expect($result['result'])->toBe('reject');
    expect($result['warnings'])->toContain('Peroxide Positive');
});

test('low ts causes warning', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate([
        'total_solids' => 10.0,
        'protein' => 3.0,
        'fat' => 3.5,
        'ph' => 6.5,
    ]);

    expect($result['result'])->toBe('reject');
    expect($result['warnings'])->toContain('TS Rendah');
});

test('low protein causes warning', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate([
        'total_solids' => 12.0,
        'protein' => 2.5,
        'fat' => 3.5,
        'ph' => 6.5,
    ]);

    expect($result['result'])->toBe('reject');
    expect($result['warnings'])->toContain('Protein Rendah');
});

test('normal values pass without warnings', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate([
        'total_solids' => 12.0,
        'protein' => 3.0,
        'fat' => 3.5,
        'ph' => 6.5,
    ]);

    expect($result['result'])->toBe('pass');
    expect($result['warnings'])->toBeEmpty();
});

test('abnormal ph causes warning', function () {
    $engine = app(QCEngine::class);
    $result = $engine->evaluate([
        'total_solids' => 12.0,
        'protein' => 3.0,
        'fat' => 3.5,
        'ph' => 7.0,
    ]);

    expect($result['result'])->toBe('reject');
    expect($result['warnings'])->toContain('pH Tidak Ideal');
});
