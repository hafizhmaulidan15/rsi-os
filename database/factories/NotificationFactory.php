<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['inventory_warning', 'shelf_life_warning', 'qc_warning']),
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => 1,
            'title' => fake()->sentence(),
            'message' => fake()->optional()->sentence(),
            'data' => null,
            'is_read' => false,
            'read_at' => null,
        ];
    }
}
