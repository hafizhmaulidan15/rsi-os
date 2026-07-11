<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QcResult extends Model
{
    use HasFactory;
    protected $fillable = [
        'milk_batch_id',
        'production_batch_id',
        'qc_type',
        'fat',
        'snf',
        'density',
        'protein',
        'lactose',
        'salts',
        'total_solids',
        'added_water',
        'freezing_point',
        'temperature',
        'ph',
        'peroxide',
        'antibiotic',
        'aroma',
        'taste',
        'texture',
        'result',
        'warnings',
    ];

    protected function casts(): array
    {
        return [
            'warnings' => 'array',
        ];
    }

    public function milkBatch(): BelongsTo
    {
        return $this->belongsTo(MilkBatch::class);
    }

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }
}
