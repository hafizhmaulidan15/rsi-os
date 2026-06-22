<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use App\Models\MilkBatch;
use App\Models\ProductionBatch;
use App\Models\QcResult;
use App\Models\ShelfLifeRecord;
use App\Services\InventoryService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private InventoryService $inventoryService) {}

    public function index(): Response
    {
        $activeBatches = ProductionBatch::whereIn('status', ['production', 'chiller'])
            ->with('milkBatch.supplier')
            ->get();

        $todayProduction = ProductionBatch::whereDate('created_at', today())->count();
        $todayQc = QcResult::whereDate('created_at', today())->count();

        $latestQc = QcResult::with('milkBatch.supplier')
            ->latest()
            ->take(5)
            ->get();

        $shelfLifeAlerts = ShelfLifeRecord::with('productionBatch')
            ->where('remaining_days', '<=', 3)
            ->where('remaining_days', '>', 0)
            ->get();

        $expiredBatches = ShelfLifeRecord::with('productionBatch')
            ->where('remaining_days', '<=', 0)
            ->get();

        $inventorySummary = $this->inventoryService->getAllStock();

        return Inertia::render('Dashboard', [
            'activeBatches' => $activeBatches,
            'todayProduction' => $todayProduction,
            'todayQc' => $todayQc,
            'latestQc' => $latestQc,
            'shelfLifeAlerts' => $shelfLifeAlerts,
            'expiredBatches' => $expiredBatches,
            'inventorySummary' => $inventorySummary,
        ]);
    }
}
