<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qc_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('milk_batch_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('production_batch_id')->nullable();
            $table->string('qc_type', 50); // raw, pasteurized, mozzarella
            $table->decimal('fat', 8, 2)->nullable();
            $table->decimal('snf', 8, 2)->nullable();
            $table->decimal('density', 8, 2)->nullable();
            $table->decimal('protein', 8, 2)->nullable();
            $table->decimal('lactose', 8, 2)->nullable();
            $table->decimal('salts', 8, 2)->nullable();
            $table->decimal('total_solids', 8, 2)->nullable();
            $table->decimal('added_water', 8, 2)->nullable();
            $table->decimal('freezing_point', 8, 2)->nullable();
            $table->decimal('temperature', 8, 2)->nullable();
            $table->decimal('ph', 8, 2)->nullable();
            $table->string('peroxide', 20)->nullable();
            $table->string('antibiotic', 20)->nullable();
            $table->text('aroma')->nullable();
            $table->text('taste')->nullable();
            $table->text('texture')->nullable();
            $table->string('result', 20); // pass, reject
            $table->text('warnings')->nullable();
            $table->timestamps();

            $table->index('milk_batch_id');
            $table->index('production_batch_id');
            $table->index('qc_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qc_results');
    }
};
