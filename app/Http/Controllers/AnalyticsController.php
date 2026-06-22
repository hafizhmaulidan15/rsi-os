<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\QcResult;
use App\Models\YieldRecord;
use App\Models\ShelfLifeRecord;
use App\Models\InventoryTransaction;
use App\Models\InventoryItem;
use App\Models\MilkBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $yieldData = YieldRecord::with('productionBatch.milkBatch.supplier')
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(fn($y) => [
                'batch' => $y->productionBatch?->batch_number,
                'supplier' => $y->productionBatch?->milkBatch?->supplier?->name,
                'predicted' => $y->predicted_yield_kg,
                'actual' => $y->actual_yield_kg,
                'variance' => $y->variance_percent,
                'date' => $y->created_at->format('Y-m-d'),
            ]);

        $qcTrend = QcResult::with('milkBatch.supplier')
            ->where('qc_type', 'raw')
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get()
            ->map(fn($q) => [
                'date' => $q->created_at->format('Y-m-d'),
                'supplier' => $q->milkBatch?->supplier?->name,
                'total_solids' => $q->total_solids,
                'fat' => $q->fat,
                'protein' => $q->protein,
                'ph' => $q->ph,
                'result' => $q->result,
            ]);

        $supplierTrend = MilkBatch::select('supplier_id', DB::raw('count(*) as total_batches'), DB::raw('avg(volume_liter) as avg_volume'))
            ->with('supplier')
            ->groupBy('supplier_id')
            ->get()
            ->map(fn($m) => [
                'supplier' => $m->supplier?->name,
                'total_batches' => $m->total_batches,
                'avg_volume' => round($m->avg_volume, 2),
            ]);

        $shelfLifeData = ShelfLifeRecord::with('productionBatch')
            ->orderBy('expiry_date', 'asc')
            ->get()
            ->map(fn($s) => [
                'batch' => $s->productionBatch?->batch_number,
                'expiry_date' => $s->expiry_date,
                'remaining_days' => $s->remaining_days,
            ]);

        $inventoryTrend = InventoryItem::where('is_active', true)->get()->map(function ($item) {
            $in = (float) InventoryTransaction::where('item_id', $item->id)->where('transaction_type', 'in')->sum('quantity');
            $out = (float) InventoryTransaction::where('item_id', $item->id)->where('transaction_type', 'out')->sum('quantity');
            return [
                'item' => $item->name,
                'stock' => $in - $out,
                'min_stock' => $item->minimum_stock,
            ];
        });

        return Inertia::render('Analytics/Index', [
            'yieldData' => $yieldData,
            'qcTrend' => $qcTrend,
            'supplierTrend' => $supplierTrend,
            'shelfLifeData' => $shelfLifeData,
            'inventoryTrend' => $inventoryTrend,
        ]);
    }
}
