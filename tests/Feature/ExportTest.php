<?php

use App\Models\User;

test('export valid mengembalikan status 200', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->get('/export/csv/production')
        ->assertStatus(200);
});

test('export tidak valid dicegah dan mengembalikan 404', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->get('/export/csv/hacker')
        ->assertStatus(404);
});
