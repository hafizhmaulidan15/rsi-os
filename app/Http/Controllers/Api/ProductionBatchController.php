<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductionBatch;
use App\Http\Requests\StoreProductionBatchRequest;

class ProductionBatchController extends Controller
{
    public function index() { return ProductionBatch::with('milkBatch.supplier')->paginate(20); }
    public function show(ProductionBatch $productionBatch) { return $productionBatch->load('milkBatch.supplier', 'milkBatch.qcResults', 'productionSteps', 'yieldRecord', 'shelfLifeRecord', 'qcResults'); }
    public function store(StoreProductionBatchRequest $request) { return ProductionBatch::create($request->validated()); }
}
