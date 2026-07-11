<?php

use App\Models\User;
use App\Models\Setting;

test('can view settings page', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('settings.index'));

    $response->assertStatus(200);
});

test('can update settings', function () {
    $admin = User::factory()->create(['email_verified_at' => now(), 'role' => 'admin']);
    $setting = Setting::factory()->create([
        'key' => 'qc_ts_min',
        'value' => '11.0',
        'group' => 'qc',
    ]);

    $response = $this->actingAs($admin)->put(route('settings.update'), [
        'settings' => [
            ['key' => 'qc_ts_min', 'value' => '12.0'],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('settings', [
        'key' => 'qc_ts_min',
        'value' => '12.0',
    ]);
});
