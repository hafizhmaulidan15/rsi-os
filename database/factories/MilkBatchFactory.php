<?php

namespace Database\Factories;

use App\Models\MilkBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MilkBatch>
 */
class MilkBatchFactory extends Factory
{
    protected $model = MilkBatch::class;

    public function definition(): array
    {
        return [
            'supplier_id' => SupplierFactory::new(),
            'batch_number' => 'RM-' . now()->format('Ymd') . '-' . fake()->unique()->numerify('###'),
            'production_target' => fake()->randomElement(['mozzarella', 'susu_cup']),
            'volume_liter' => fake()->randomFloat(2, 100, 1000),
            'received_date' => now()->format('Y-m-d'),
            'received_time' => fake()->time('H:i'),
            'status' => fake()->randomElement(['pending_qc', 'approved', 'rejected']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
