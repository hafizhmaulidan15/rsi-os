<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MilkBatch;
use App\Http\Requests\StoreMilkBatchRequest;

class MilkBatchController extends Controller
{
    public function index() { return MilkBatch::with('supplier')->paginate(20); }
    public function show(MilkBatch $milkBatch) { return $milkBatch->load('supplier', 'qcResults'); }
    public function store(StoreMilkBatchRequest $request) { return MilkBatch::create($request->validated()); }
}
