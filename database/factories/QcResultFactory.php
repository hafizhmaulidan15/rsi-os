<?php

namespace Database\Factories;

use App\Models\QcResult;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QcResult>
 */
class QcResultFactory extends Factory
{
    protected $model = QcResult::class;

    public function definition(): array
    {
        return [
            'milk_batch_id' => \App\Models\MilkBatch::factory(),
            'production_batch_id' => null,
            'qc_type' => 'raw',
            'fat' => fake()->randomFloat(2, 3.0, 5.0),
            'snf' => fake()->randomFloat(2, 7.0, 9.0),
            'density' => fake()->randomFloat(3, 1.025, 1.035),
            'protein' => fake()->randomFloat(2, 2.5, 3.5),
            'lactose' => fake()->randomFloat(2, 4.0, 5.5),
            'salts' => fake()->randomFloat(3, 0.5, 0.9),
            'total_solids' => fake()->randomFloat(2, 10.0, 14.0),
            'added_water' => fake()->randomFloat(2, 0, 5),
            'freezing_point' => fake()->randomFloat(3, -0.550, -0.500),
            'temperature' => fake()->randomFloat(1, 2.0, 8.0),
            'ph' => fake()->randomFloat(1, 6.4, 6.8),
            'peroxide' => 'negative',
            'antibiotic' => 'negative',
            'aroma' => 'normal',
            'taste' => 'normal',
            'texture' => 'normal',
            'result' => 'pass',
            'warnings' => null,
        ];
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'peroxide' => fake()->randomElement(['positive', 'negative']),
            'antibiotic' => fake()->randomElement(['positive', 'negative']),
            'result' => 'reject',
            'warnings' => 'QC test failed',
        ]);
    }
}
