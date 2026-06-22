<?php

namespace App\Services;

use App\Models\Setting;

class YieldEngine
{
    public function predict(float $volumeLiters, float $totalSolids, ?float $factor = null): float
    {
        $f = $factor ?? (float) (Setting::where('key', 'yield_default_factor')->value('value') ?? 0.12);
        return round($volumeLiters * ($totalSolids / 100) * $f, 2);
    }

    public function calculateVariance(float $predicted, float $actual): float
    {
        if ($predicted === 0.0) {
            return 0.0;
        }
        return round((($actual - $predicted) / $predicted) * 100, 2);
    }
}
