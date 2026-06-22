<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    public function definition(): array
    {
        return [
            'item_code' => fake()->unique()->bothify('ITEM-####'),
            'name' => fake()->word(),
            'category' => fake()->randomElement(['mozzarella', 'susu_cup', 'packaging']),
            'unit' => fake()->randomElement(['kg', 'pcs', 'pack', 'roll']),
            'minimum_stock' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
