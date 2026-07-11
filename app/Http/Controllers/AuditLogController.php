<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::with('user:id,name,email')
            ->latest()
            ->paginate(15);

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
