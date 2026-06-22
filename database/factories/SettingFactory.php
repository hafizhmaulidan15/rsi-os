<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SettingFactory extends Factory
{
    protected $model = Setting::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->word(),
            'value' => fake()->randomFloat(2, 1, 20),
            'group' => fake()->randomElement(['qc', 'shelf_life', 'yield']),
        ];
    }
}
