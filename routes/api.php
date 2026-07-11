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

Route::middleware('auth:sanctum')->prefix('api')->as('api.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('milk-batches', MilkBatchController::class)->only(['index', 'show', 'store']);
    Route::get('qc-results', [QcResultController::class, 'index'])->name('qc-results.index');
    Route::get('qc-results/{qcResult}', [QcResultController::class, 'show'])->name('qc-results.show');
    Route::post('qc-results', [QcResultController::class, 'store'])->name('qc-results.store');
    Route::apiResource('production-batches', ProductionBatchController::class)->only(['index', 'show', 'store']);

    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('inventory/items', [InventoryController::class, 'items'])->name('inventory.items');
    Route::post('inventory/transactions', [InventoryController::class, 'storeTransaction'])->name('inventory.transactions.store');

    Route::get('analytics/yield', [AnalyticsController::class, 'yield'])->name('analytics.yield');
    Route::get('analytics/qc', [AnalyticsController::class, 'qc'])->name('analytics.qc');
    Route::get('analytics/suppliers', [AnalyticsController::class, 'suppliers'])->name('analytics.suppliers');
    Route::get('analytics/shelf-life', [AnalyticsController::class, 'shelfLife'])->name('analytics.shelf-life');

    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

    Route::get('shelf-life', [ShelfLifeController::class, 'index'])->name('shelf-life.index');
    Route::get('yield-records', [YieldRecordController::class, 'index'])->name('yield-records.index');
});
