<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\MilkBatchController;
use App\Http\Controllers\Api\QcResultController;
use App\Http\Controllers\Api\ProductionBatchController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ShelfLifeController;
use App\Http\Controllers\Api\YieldRecordController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('milk-batches', MilkBatchController::class)->only(['index', 'show', 'store']);
    Route::get('qc-results', [QcResultController::class, 'index']);
    Route::get('qc-results/{qcResult}', [QcResultController::class, 'show']);
    Route::post('qc-results', [QcResultController::class, 'store']);
    Route::apiResource('production-batches', ProductionBatchController::class)->only(['index', 'show', 'store']);

    Route::get('inventory', [InventoryController::class, 'index']);
    Route::get('inventory/items', [InventoryController::class, 'items']);
    Route::post('inventory/transactions', [InventoryController::class, 'storeTransaction']);

    Route::get('analytics/yield', [AnalyticsController::class, 'yield']);
    Route::get('analytics/qc', [AnalyticsController::class, 'qc']);
    Route::get('analytics/suppliers', [AnalyticsController::class, 'suppliers']);
    Route::get('analytics/shelf-life', [AnalyticsController::class, 'shelfLife']);

    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);

    Route::get('shelf-life', [ShelfLifeController::class, 'index']);
    Route::get('yield-records', [YieldRecordController::class, 'index']);
});
