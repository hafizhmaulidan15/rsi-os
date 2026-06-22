<?php

namespace App\Http\Controllers;

use App\Models\MilkBatch;
use App\Services\AuditService;
use App\Services\BatchNumberService;
use App\Enums\BatchStatus;
use App\Http\Requests\StoreMilkBatchRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MilkBatchController extends Controller
{
    public function __construct(
        private BatchNumberService $batchNumberService,
        private AuditService $auditService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('MilkIntake/Index', [
            'milkBatches' => MilkBatch::with('supplier')
                ->orderBy('received_date', 'desc')
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MilkIntake/Create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name', 'supplier_code']),
        ]);
    }

    public function store(StoreMilkBatchRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['batch_number'] = $this->batchNumberService->generate('RM');
        $validated['status'] = BatchStatus::PendingQc->value;

        $batch = MilkBatch::create($validated);

        $this->auditService->log('milk_batch_created', 'milk_batches', $batch->id, null, $validated);

        return redirect()->route('milk-batches.show', $batch)->with('success', 'Penerimaan susu berhasil dicatat.');
    }

    public function show(MilkBatch $milkBatch): Response
    {
        $milkBatch->load('supplier', 'qcResults');

        return Inertia::render('MilkIntake/Show', [
            'milkBatch' => $milkBatch,
        ]);
    }

    public function edit(MilkBatch $milkBatch): Response
    {
        return Inertia::render('MilkIntake/Edit', [
            'milkBatch' => $milkBatch,
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name', 'supplier_code']),
        ]);
    }

    public function update(Request $request, MilkBatch $milkBatch): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'volume_liter' => 'required|numeric|min:0.01',
            'production_target' => 'required|in:mozzarella,susu_cup',
            'received_date' => 'required|date',
            'received_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        $old = $milkBatch->toArray();
        $milkBatch->update($validated);

        $this->auditService->log('milk_batch_updated', 'milk_batches', $milkBatch->id, $old, $validated);

        return redirect()->route('milk-batches.index')->with('success', 'Data penerimaan susu berhasil diupdate.');
    }

    public function destroy(MilkBatch $milkBatch): RedirectResponse
    {
        $old = $milkBatch->toArray();
        $milkBatch->delete();

        $this->auditService->log('milk_batch_deleted', 'milk_batches', $milkBatch->id, $old, null);

        return redirect()->route('milk-batches.index')->with('success', 'Penerimaan susu berhasil dihapus.');
    }
}
