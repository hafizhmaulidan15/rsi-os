<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\YieldRecord;
use Illuminate\Http\JsonResponse;

class YieldRecordController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            YieldRecord::with('productionBatch.milkBatch.supplier')
                ->orderBy('created_at', 'desc')
                ->paginate(20)
        );
    }
}
