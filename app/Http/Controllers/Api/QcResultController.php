<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QcResult;
use App\Models\User;
use App\Http\Requests\StoreQcResultRequest;
use App\Services\QCEngine;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

class QcResultController extends Controller
{
    public function __construct(
        private QCEngine $qcEngine,
        private AuditService $auditService,
        private NotificationService $notificationService,
    ) {}
    
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

        $this->auditService->log('qc_created', 'qc_results', $qcResult->id, null, $qcResult->toArray());

        if ($result['result'] === 'reject') {
            $batchNumber = $qcResult->milkBatch?->batch_number ?? 'Unknown';
            $adminId = User::where('role', 'admin')->first()->id ?? Auth::id();
            $this->notificationService->create(
                'qc_warning',
                "QC Failed: {$batchNumber}",
                "Batch ditolak karena: " . implode(', ', $result['warnings']),
                User::class,
                $adminId,
                ['qc_result_id' => $qcResult->id]
            );
        }

        return $qcResult->load('milkBatch.supplier');
    }
}
