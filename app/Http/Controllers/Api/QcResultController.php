<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QcResult;
use App\Http\Requests\StoreQcResultRequest;
use App\Services\QCEngine;

class QcResultController extends Controller
{
    public function __construct(private QCEngine $qcEngine) {}
    
    public function index() { return QcResult::with('milkBatch.supplier')->paginate(20); }
    public function show(QcResult $qcResult) { return $qcResult->load('milkBatch.supplier', 'productionBatch'); }
    
    public function store(StoreQcResultRequest $request)
    {
        $data = $request->validated();
        $result = $this->qcEngine->evaluate($data);
        $qcResult = QcResult::create(array_merge($data, [
            'result' => $result['result'],
            'warnings' => json_encode($result['warnings']),
        ]));
        return $qcResult->load('milkBatch.supplier');
    }
}
