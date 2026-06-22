<?php

namespace App\Http\Controllers;

use App\Models\ShelfLifeRecord;
use Inertia\Inertia;
use Inertia\Response;

class ShelfLifeController extends Controller
{
    public function index(): Response
    {
        $records = ShelfLifeRecord::with('productionBatch.milkBatch.supplier')
            ->orderBy('remaining_days', 'asc')
            ->paginate(50);

        return Inertia::render('ShelfLife/Index', [
            'records' => $records,
        ]);
    }
}
