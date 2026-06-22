<?php

namespace Database\Factories;

use App\Models\ProductionBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductionBatch>
 */
class ProductionBatchFactory extends Factory
{
    protected $model = ProductionBatch::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['mozzarella', 'susu_cup']);
        $prefix = $type === 'mozzarella' ? 'MZ' : 'SC';

        return [
            'milk_batch_id' => \App\Models\MilkBatch::factory(),
            'batch_number' => $prefix . '-' . now()->format('Ymd') . '-' . fake()->unique()->numerify('###'),
            'production_type' => $type,
            'start_time' => now()->subHours(fake()->numberBetween(1, 8)),
            'end_time' => null,
            'status' => fake()->randomElement(['in_progress', 'completed', 'rejected']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
