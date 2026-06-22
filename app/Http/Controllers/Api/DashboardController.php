<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductionBatch;
use App\Models\MilkBatch;
use App\Models\QcResult;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'active_batches' => ProductionBatch::whereNotIn('status', ['closed'])->count(),
            'today_intake' => MilkBatch::whereDate('received_date', today())->count(),
            'today_qc' => QcResult::whereDate('created_at', today())->count(),
        ]);
    }
}
