<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ShelfLifeRecord extends Model
{
    protected $appends = ['remaining_days'];

    protected $fillable = [
        'production_batch_id',
        'chiller_in_date',
        'chiller_in_time',
        'shelf_life_days',
        'expiry_date',
    ];

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }

    protected function remainingDays(): Attribute
    {
        return Attribute::make(
            get: fn () => max(0, now()->diffInDays(Carbon::parse($this->expiry_date), false))
        );
    }
}
