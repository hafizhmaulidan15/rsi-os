<?php

use App\Models\User;

test('analytics page loads successfully', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('analytics.index'));

    $response->assertStatus(200);
});
