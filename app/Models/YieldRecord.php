<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class YieldRecord extends Model
{
    protected $fillable = [
        'production_batch_id',
        'predicted_yield_kg',
        'actual_yield_kg',
        'variance_percent',
    ];

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }
}
