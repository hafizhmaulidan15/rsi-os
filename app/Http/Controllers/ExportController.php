<?php

namespace App\Http\Controllers;

use App\Models\ProductionBatch;
use App\Models\QcResult;
use App\Models\InventoryTransaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class ExportController extends Controller
{
    public function csv(string $type): Response
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$type-export.csv\"",
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
        $data = [];
        switch ($type) {
            case 'production':
                $data['items'] = ProductionBatch::with('milkBatch.supplier')->latest()->get();
                $data['title'] = 'Production Report';
                break;
            case 'qc':
                $data['items'] = QcResult::with('milkBatch.supplier')->latest()->get();
                $data['title'] = 'QC Report';
                break;
        }

        $pdf = Pdf::loadView('exports.report', $data);
        return $pdf->download("$type-report.pdf");
    }
}
