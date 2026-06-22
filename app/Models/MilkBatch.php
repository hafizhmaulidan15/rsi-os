<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MilkBatch extends Model
{
    use HasFactory;
    protected $fillable = [
        'batch_number',
        'supplier_id',
        'production_target',
        'volume_liter',
        'received_date',
        'received_time',
        'status',
        'notes',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function qcResults(): HasMany
    {
        return $this->hasMany(QcResult::class);
    }

    public function productionBatches(): HasMany
    {
        return $this->hasMany(ProductionBatch::class);
    }
}
