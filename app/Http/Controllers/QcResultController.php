<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQcResultRequest;
use App\Models\MilkBatch;
use App\Models\QcResult;
use App\Services\AuditService;
use App\Services\NotificationService;
use App\Services\QCEngine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QcResultController extends Controller
{
    public function __construct(
        private QCEngine $qcEngine,
        private AuditService $auditService,
        private NotificationService $notificationService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('QC/Index', [
            'qcResults' => QcResult::with('milkBatch.supplier', 'productionBatch')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
        ]);
    }

    public function create(Request $request): Response
    {
        $milkBatch = null;
        if ($request->has('milk_batch_id')) {
            $milkBatch = MilkBatch::with('supplier')->findOrFail($request->milk_batch_id);
        }

        return Inertia::render('QC/Create', [
            'milkBatches' => MilkBatch::with('supplier')
                ->where('status', 'pending_qc')
                ->orderBy('received_date', 'desc')
                ->get(['id', 'batch_number', 'supplier_id', 'volume_liter', 'received_date']),
            'productionBatches' => \App\Models\ProductionBatch::orderBy('created_at', 'desc')
                ->get(['id', 'batch_number', 'production_type']),
            'selectedMilkBatch' => $milkBatch,
        ]);
    }

    public function store(StoreQcResultRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $evaluation = $this->qcEngine->evaluate($validated);
        $validated['result'] = $evaluation['result'];
        $validated['warnings'] = !empty($evaluation['warnings']) ? json_encode($evaluation['warnings']) : null;

        $qcResult = QcResult::create($validated);

        $batchNumber = 'Unknown';
        if ($validated['qc_type'] === 'raw') {
            $milkBatch = MilkBatch::find($validated['milk_batch_id']);
            if ($milkBatch) {
                $batchNumber = $milkBatch->batch_number;
                $milkBatch->update([
                    'status' => $evaluation['result'] === 'reject' ? 'rejected' : 'approved',
                ]);
            }
        }

        if ($evaluation['result'] === 'reject') {
            $this->notificationService->create(
                type: 'qc_warning',
                title: 'QC Failed: ' . $batchNumber,
                message: 'Batch ditolak karena ' . implode(', ', $evaluation['warnings'] ?? ['QC gagal']),
                notifiableType: 'App\Models\User',
                notifiableId: 1,
                data: ['qc_result_id' => $qcResult->id, 'milk_batch_id' => $validated['milk_batch_id'] ?? null],
            );
        }

        $this->auditService->log('qc_created', 'qc_results', $qcResult->id, null, $validated);

        return redirect()->route('qc.index')->with('success', 'Hasil QC berhasil disimpan.');
    }
}
