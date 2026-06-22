<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;
    protected $fillable = [
        'supplier_code',
        'name',
        'phone',
        'address',
        'notes',
    ];

    public function milkBatches(): HasMany
    {
        return $this->hasMany(MilkBatch::class);
    }
}
