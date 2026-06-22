<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_batch_id')->constrained()->cascadeOnDelete();
            $table->decimal('rennet_ml', 10, 2)->nullable();
            $table->decimal('nitric_acid_ml', 10, 2)->nullable();
            $table->decimal('target_temperature', 8, 2)->nullable();
            $table->decimal('actual_temperature', 8, 2)->nullable();
            $table->integer('holding_time_minutes')->nullable();
            $table->integer('cooling_time_minutes')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('production_batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_steps');
    }
};
