<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductionBatch extends Model
{
    use HasFactory;
    protected $fillable = [
        'batch_number',
        'milk_batch_id',
        'production_type',
        'start_time',
        'end_time',
        'status',
        'notes',
    ];

    public function milkBatch(): BelongsTo
    {
        return $this->belongsTo(MilkBatch::class);
    }

    public function productionSteps(): HasMany
    {
        return $this->hasMany(ProductionStep::class);
    }

    public function yieldRecord(): HasOne
    {
        return $this->hasOne(YieldRecord::class);
    }

    public function shelfLifeRecord(): HasOne
    {
        return $this->hasOne(ShelfLifeRecord::class);
    }

    public function qcResults(): HasMany
    {
        return $this->hasMany(QcResult::class);
    }
}
