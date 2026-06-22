<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number', 100)->unique();
            $table->foreignId('milk_batch_id')->constrained()->cascadeOnDelete();
            $table->string('production_type', 50); // mozzarella, susu_cup
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->string('status', 50); // production, chiller, ready, closed
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('milk_batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batches');
    }
};
