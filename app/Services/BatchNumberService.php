<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class BatchNumberService
{
    public function generate(string $prefix): string
    {
        return DB::transaction(function () use ($prefix) {
            $date = now()->format('Ymd');

            $table = match ($prefix) {
                'RM' => 'milk_batches',
                'MZ' => 'production_batches',
                'SC' => 'production_batches',
                default => 'milk_batches',
            };

            $lastBatch = DB::table($table)
                ->where('batch_number', 'like', "{$prefix}-{$date}-%")
                ->orderBy('batch_number', 'desc')
                ->lockForUpdate()
                ->value('batch_number');

            if ($lastBatch) {
                $parts = explode('-', $lastBatch);
                $lastNumber = (int) end($parts);
                $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $newNumber = '001';
            }

            return "{$prefix}-{$date}-{$newNumber}";
        });
    }
}
