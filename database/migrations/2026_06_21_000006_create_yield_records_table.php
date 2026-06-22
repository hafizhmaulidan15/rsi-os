<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('yield_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_batch_id')->constrained()->cascadeOnDelete();
            $table->decimal('predicted_yield_kg', 10, 2)->nullable();
            $table->decimal('actual_yield_kg', 10, 2)->nullable();
            $table->decimal('variance_percent', 8, 2)->nullable();
            $table->timestamps();

            $table->index('production_batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yield_records');
    }
};
