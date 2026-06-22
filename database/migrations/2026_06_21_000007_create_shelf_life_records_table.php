<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shelf_life_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_batch_id')->constrained()->cascadeOnDelete();
            $table->date('chiller_in_date');
            $table->time('chiller_in_time');
            $table->integer('shelf_life_days')->default(14);
            $table->date('expiry_date');
            $table->integer('remaining_days')->default(0);
            $table->timestamps();

            $table->index('production_batch_id');
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shelf_life_records');
    }
};
