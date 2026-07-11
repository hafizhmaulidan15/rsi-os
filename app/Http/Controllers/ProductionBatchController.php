<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\ProductionStep;
use App\Models\YieldRecord;
use App\Models\ShelfLifeRecord;
use App\Models\MilkBatch;
use App\Services\AuditService;
use App\Services\BatchNumberService;
use App\Services\YieldEngine;
use App\Services\ShelfLifeService;
use App\Enums\ProductionStatus;
use App\Http\Requests\StoreProductionBatchRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionBatchController extends Controller
{
    public function __construct(
        private BatchNumberService $batchNumberService,
        private YieldEngine $yieldEngine,
        private ShelfLifeService $shelfLifeService,
        private AuditService $auditService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Production/Index', [
            'productionBatches' => ProductionBatch::with('milkBatch.supplier')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
            'filter' => 'all',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Production/Create', [
            'milkBatches' => MilkBatch::with('supplier')
                ->whereIn('status', ['approved', 'consumed'])
                ->orderBy('received_date', 'desc')
                ->get(['id', 'batch_number', 'supplier_id', 'volume_liter', 'received_date']),
        ]);
    }

    public function store(StoreProductionBatchRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['batch_number'] = $this->batchNumberService->generate(
            $validated['production_type'] === 'mozzarella' ? 'MZ' : 'SC'
        );
        $validated['status'] = ProductionStatus::Production->value;

        $batch = ProductionBatch::create($validated);

        $milkBatch = MilkBatch::find($validated['milk_batch_id']);
        if ($milkBatch && $milkBatch->status === 'approved') {
            $milkBatch->update(['status' => 'consumed']);
        }

        $this->auditService->log('production_batch_created', 'production_batches', $batch->id, null, $validated);

        return redirect()->route('production.show', $batch)->with('success', 'Batch produksi berhasil dibuat.');
    }

    public function mozzarella(): Response
    {
        return Inertia::render('Production/Index', [
            'productionBatches' => ProductionBatch::with('milkBatch.supplier')
                ->where('production_type', 'mozzarella')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
            'filter' => 'mozzarella',
        ]);
    }

    public function susuCup(): Response
    {
        return Inertia::render('Production/Index', [
            'productionBatches' => ProductionBatch::with('milkBatch.supplier')
                ->where('production_type', 'susu_cup')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
            'filter' => 'susu_cup',
        ]);
    }

    public function show(ProductionBatch $productionBatch): Response
    {
        $productionBatch->load([
            'milkBatch.supplier',
            'milkBatch.qcResults',
            'productionSteps',
            'yieldRecord',
            'shelfLifeRecord',
            'qcResults',
        ]);

        return Inertia::render('Production/Show', [
            'productionBatch' => $productionBatch,
        ]);
    }

    public function updateSteps(Request $request, ProductionBatch $productionBatch): RedirectResponse
    {
        $validated = $request->validate([
            'rennet_ml' => 'nullable|numeric|min:0',
            'nitric_acid_ml' => 'nullable|numeric|min:0',
            'target_temperature' => 'nullable|numeric',
            'actual_temperature' => 'nullable|numeric',
            'holding_time_minutes' => 'nullable|integer|min:0',
            'cooling_time_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $steps = $productionBatch->productionSteps()->firstOrNew([]);
        $steps->fill($validated);
        $steps->production_batch_id = $productionBatch->id;
        $steps->save();

        $this->auditService->log('production_steps_updated', 'production_steps', $steps->id, null, $validated);

        return redirect()->back()->with('success', 'Data proses produksi disimpan.');
    }

    public function updateYield(Request $request, ProductionBatch $productionBatch): RedirectResponse
    {
        $validated = $request->validate([
            'actual_yield_kg' => 'required|numeric|min:0',
        ]);

        $milkBatch = $productionBatch->milkBatch;
        $qcResult = $milkBatch->qcResults()->where('qc_type', 'raw')->latest()->first();
        $totalSolids = $qcResult?->total_solids ?? 11.0;

        $predictedYield = $this->yieldEngine->predict(
            (float) $milkBatch->volume_liter,
            (float) $totalSolids,
        );

        $variance = $this->yieldEngine->calculateVariance($predictedYield, (float) $validated['actual_yield_kg']);

        YieldRecord::updateOrCreate(
            ['production_batch_id' => $productionBatch->id],
            [
                'predicted_yield_kg' => $predictedYield,
                'actual_yield_kg' => $validated['actual_yield_kg'],
                'variance_percent' => $variance,
            ]
        );

        $this->auditService->log('yield_updated', 'yield_records', $productionBatch->id, null, $validated);

        return redirect()->back()->with('success', 'Data yield disimpan.');
    }

    public function updateShelfLife(Request $request, ProductionBatch $productionBatch): RedirectResponse
    {
        $validated = $request->validate([
            'chiller_in_date' => 'required|date',
            'chiller_in_time' => 'required|date_format:H:i',
            'shelf_life_days' => 'nullable|integer|min:1',
        ]);

        $calculated = $this->shelfLifeService->calculate(
            $validated['chiller_in_date'],
            $validated['chiller_in_time'],
            isset($validated['shelf_life_days']) ? (int) $validated['shelf_life_days'] : null,
        );

        ShelfLifeRecord::updateOrCreate(
            ['production_batch_id' => $productionBatch->id],
            [
                'chiller_in_date' => $validated['chiller_in_date'],
                'chiller_in_time' => $validated['chiller_in_time'],
                'shelf_life_days' => $calculated['shelf_life_days'],
                'expiry_date' => $calculated['expiry_date'],
                'remaining_days' => $calculated['remaining_days'],
            ]
        );

        if ($productionBatch->status === 'production') {
            $productionBatch->update(['status' => 'chiller']);
        }

        $this->auditService->log('shelf_life_updated', 'shelf_life_records', $productionBatch->id, null, $validated);

        return redirect()->back()->with('success', 'Data shelf life disimpan.');
    }

    public function updateStatus(Request $request, ProductionBatch $productionBatch): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:chiller,ready,closed',
        ]);

        $old = $productionBatch->toArray();
        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'closed' && $productionBatch->status !== 'closed') {
            $updateData['end_time'] = now();
        }

        $productionBatch->update($updateData);

        $this->auditService->log('production_batch_updated', 'production_batches', $productionBatch->id, $old, $updateData);

        $label = match ($validated['status']) {
            'chiller' => 'masuk chiller',
            'ready' => 'siap dijual',
            'closed' => 'ditutup',
            default => 'diupdate',
        };

        return redirect()->back()->with('success', "Batch berhasil {$label}.");
    }
}
