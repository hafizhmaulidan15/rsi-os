<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\QcResult;
use App\Models\InventoryTransaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    private const ALLOWED_TYPES = ['production', 'qc', 'inventory'];

    public function csv(string $type): StreamedResponse
    {
        if (!in_array($type, self::ALLOWED_TYPES)) {
            abort(404);
        }

        $safeType = preg_replace('/[^a-z0-9_-]/i', '', $type);
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$safeType}-export.csv\"",
        ];

        $callback = function () use ($type) {
            $handle = fopen('php://output', 'w');

            switch ($type) {
                case 'production':
                    fputcsv($handle, ['Batch', 'Type', 'Supplier', 'Status', 'Start Time']);
                    ProductionBatch::with('milkBatch.supplier')->chunk(100, function ($batches) use ($handle) {
                        foreach ($batches as $b) {
                            fputcsv($handle, [
                                $b->batch_number,
                                $b->production_type,
                                $b->milkBatch?->supplier?->name,
                                $b->status,
                                $b->start_time,
                            ]);
                        }
                    });
                    break;
                case 'qc':
                    fputcsv($handle, ['Supplier', 'TS', 'Fat', 'Protein', 'pH', 'Result', 'Date']);
                    QcResult::with('milkBatch.supplier')->chunk(100, function ($results) use ($handle) {
                        foreach ($results as $q) {
                            fputcsv($handle, [
                                $q->milkBatch?->supplier?->name,
                                $q->total_solids,
                                $q->fat,
                                $q->protein,
                                $q->ph,
                                $q->result,
                                $q->created_at,
                            ]);
                        }
                    });
                    break;
                case 'inventory':
                    fputcsv($handle, ['Item', 'Type', 'Quantity', 'Date', 'Notes']);
                    InventoryTransaction::with('item')->chunk(100, function ($txns) use ($handle) {
                        foreach ($txns as $t) {
                            fputcsv($handle, [
                                $t->item?->name,
                                $t->transaction_type,
                                $t->quantity,
                                $t->transaction_date,
                                $t->notes,
                            ]);
                        }
                    });
                    break;
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function pdf(string $type)
    {
        if (!in_array($type, self::ALLOWED_TYPES)) {
            abort(404);
        }

        $safeType = preg_replace('/[^a-z0-9_-]/i', '', $type);
        $data = [];
        switch ($type) {
            case 'production':
                $data['items'] = ProductionBatch::with('milkBatch.supplier')->latest()->get()->map(fn($b) => [
                    'Batch' => $b->batch_number,
                    'Tipe' => ucwords(str_replace('_', ' ', $b->production_type)),
                    'Supplier' => $b->milkBatch?->supplier?->name ?? '-',
                    'Status' => $b->status,
                    'Mulai' => $b->start_time,
                ]);
                $data['title'] = 'Laporan Produksi';
                $data['columns'] = ['Batch', 'Tipe', 'Supplier', 'Status', 'Mulai'];
                break;
            case 'qc':
                $data['items'] = QcResult::with('milkBatch.supplier', 'productionBatch')
                    ->latest()
                    ->get()
                    ->map(fn($q) => [
                        'Batch' => $q->milkBatch?->batch_number ?? $q->productionBatch?->batch_number ?? '-',
                        'Tipe' => $q->qc_type === 'pasteurized' ? 'Pasteurisasi' : 'Mentah',
                        'Supplier' => $q->milkBatch?->supplier?->name ?? '-',
                        'pH' => $q->ph ?? '-',
                        'TS' => $q->total_solids ?? '-',
                        'Lemak' => $q->fat ?? '-',
                        'Protein' => $q->protein ?? '-',
                        'Aroma' => $q->aroma ?? '-',
                        'Rasa' => $q->taste ?? '-',
                        'Hasil' => $q->result === 'pass'
                            ? '<span class="badge badge-pass">LULUS</span>'
                            : '<span class="badge badge-reject">DITOLAK</span>',
                        'Tanggal' => $q->created_at?->format('d/m/Y'),
                    ]);
                $data['title'] = 'Laporan Quality Control';
                $data['columns'] = ['Batch', 'Tipe', 'Supplier', 'pH', 'TS', 'Lemak', 'Protein', 'Aroma', 'Rasa', 'Hasil', 'Tanggal'];
                break;
            case 'inventory':
                $data['items'] = InventoryTransaction::with('item')
                    ->latest()
                    ->get()
                    ->map(fn($t) => [
                        'Item' => $t->item?->name ?? '-',
                        'Tipe' => $t->transaction_type === 'in' ? 'Masuk' : 'Keluar',
                        'Jumlah' => $t->quantity,
                        'Tanggal' => $t->transaction_date?->format('d/m/Y'),
                        'Catatan' => $t->notes ?? '-',
                    ]);
                $data['title'] = 'Laporan Inventory';
                $data['columns'] = ['Item', 'Tipe', 'Jumlah', 'Tanggal', 'Catatan'];
                break;
        }

        $pdf = Pdf::loadView('exports.report', $data);
        return $pdf->download("{$safeType}-report.pdf");
    }
}
