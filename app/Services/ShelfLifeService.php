<?php

namespace App\Services;

use App\Models\Setting;
use Carbon\Carbon;

class ShelfLifeService
{
    public function calculate(string $chillerInDate, string $chillerInTime, ?int $shelfLifeDays = null): array
    {
        $days = $shelfLifeDays ?? (int) (Setting::where('key', 'shelf_life_default_days')->value('value') ?? 14);
        $chillerIn = Carbon::parse($chillerInDate . ' ' . $chillerInTime);
        $expiryDate = $chillerIn->copy()->addDays($days);
        $now = Carbon::now();
        $remainingDays = max(0, $now->diffInDays($expiryDate, false));

        return [
            'shelf_life_days' => $days,
            'expiry_date' => $expiryDate->format('Y-m-d'),
            'remaining_days' => (int) $remainingDays,
        ];
    }
}
