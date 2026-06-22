<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShelfLifeRecord extends Model
{
    protected $fillable = [
        'production_batch_id',
        'chiller_in_date',
        'chiller_in_time',
        'shelf_life_days',
        'expiry_date',
        'remaining_days',
    ];

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }
}
