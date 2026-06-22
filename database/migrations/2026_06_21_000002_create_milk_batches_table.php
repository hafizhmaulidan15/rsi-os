<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('milk_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number', 100)->unique();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->string('production_target', 50); // mozzarella, susu_cup
            $table->decimal('volume_liter', 10, 2);
            $table->date('received_date');
            $table->time('received_time');
            $table->string('status', 50); // pending_qc, approved, rejected, consumed
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('received_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milk_batches');
    }
};
