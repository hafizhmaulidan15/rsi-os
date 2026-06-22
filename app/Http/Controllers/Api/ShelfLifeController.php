<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShelfLifeRecord;
use App\Services\ShelfLifeService;
use Illuminate\Http\JsonResponse;

class ShelfLifeController extends Controller
{
    public function __construct(
        private ShelfLifeService $shelfLifeService,
    ) {}

    public function index(): JsonResponse
    {
        $records = ShelfLifeRecord::with('productionBatch.milkBatch.supplier')
            ->orderBy('remaining_days')
            ->get()
            ->map(function ($record) {
                $record->age = $record->created_at?->diffInDays(now()) ?? 0;
                return $record;
            });

        return response()->json($records);
    }
}
