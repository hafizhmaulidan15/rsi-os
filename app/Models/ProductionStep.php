<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionStep extends Model
{
    protected $fillable = [
        'production_batch_id',
        'rennet_ml',
        'nitric_acid_ml',
        'target_temperature',
        'actual_temperature',
        'holding_time_minutes',
        'cooling_time_minutes',
        'notes',
    ];

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }
}
