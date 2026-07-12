<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\YieldRecord;
use App\Models\QcResult;
use App\Models\ShelfLifeRecord;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function yield() {
        return YieldRecord::with('productionBatch.milkBatch.supplier')
            ->orderBy('created_at', 'desc')->take(50)->get();
    }
    
    public function qc() {
        return QcResult::with('milkBatch.supplier')
            ->where('qc_type', 'raw')
            ->orderBy('created_at', 'desc')->take(100)->get();
    }
    
    public function suppliers() {
        return DB::table('milk_batches')
            ->select('supplier_id', DB::raw('count(*) as total_batches'), DB::raw('avg(volume_liter) as avg_volume'))
            ->groupBy('supplier_id')->get();
    }
    
    public function shelfLife() {
        return ShelfLifeRecord::with('productionBatch')
            ->orderBy('expiry_date', 'asc')->take(50)->get();
    }
}
