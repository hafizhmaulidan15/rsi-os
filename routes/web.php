<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\MilkBatchController;
use App\Http\Controllers\QcResultController;
use App\Http\Controllers\ProductionBatchController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ShelfLifeController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::get('/create', [SupplierController::class, 'create'])->name('suppliers.create');
        Route::post('/', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::get('/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
    });

    Route::prefix('milk-intake')->group(function () {
        Route::get('/', [MilkBatchController::class, 'index'])->name('milk-batches.index');
        Route::get('/create', [MilkBatchController::class, 'create'])->name('milk-batches.create');
        Route::post('/', [MilkBatchController::class, 'store'])->name('milk-batches.store');
        Route::get('/{milkBatch}', [MilkBatchController::class, 'show'])->name('milk-batches.show');
        Route::get('/{milkBatch}/edit', [MilkBatchController::class, 'edit'])->name('milk-batches.edit');
        Route::put('/{milkBatch}', [MilkBatchController::class, 'update'])->name('milk-batches.update');
        Route::delete('/{milkBatch}', [MilkBatchController::class, 'destroy'])->name('milk-batches.destroy');
    });

    Route::prefix('production')->group(function () {
        Route::get('/', [ProductionBatchController::class, 'index'])->name('production.index');
        Route::get('/create', [ProductionBatchController::class, 'create'])->name('production.create');
        Route::post('/', [ProductionBatchController::class, 'store'])->name('production.store');
        Route::get('/mozzarella', [ProductionBatchController::class, 'mozzarella'])->name('production.mozzarella');
        Route::get('/susu-cup', [ProductionBatchController::class, 'susuCup'])->name('production.susu-cup');
        Route::get('/batches', [ProductionBatchController::class, 'index'])->name('production.batches');
        Route::get('/{productionBatch}', [ProductionBatchController::class, 'show'])->name('production.show');
        Route::post('/{productionBatch}/steps', [ProductionBatchController::class, 'updateSteps'])->name('production.steps');
        Route::post('/{productionBatch}/yield', [ProductionBatchController::class, 'updateYield'])->name('production.yield');
        Route::post('/{productionBatch}/shelf-life', [ProductionBatchController::class, 'updateShelfLife'])->name('production.shelf-life');
    });

    Route::prefix('inventory')->group(function () {
        Route::get('/', [InventoryController::class, 'index'])->name('inventory.index');
        Route::get('/items', [InventoryController::class, 'items'])->name('inventory.items');
        Route::post('/items', [InventoryController::class, 'storeItem'])->name('inventory.items.store');
        Route::put('/items/{inventoryItem}', [InventoryController::class, 'updateItem'])->name('inventory.items.update');
        Route::delete('/items/{inventoryItem}', [InventoryController::class, 'destroyItem'])->name('inventory.items.destroy');
        Route::get('/transactions/create', [InventoryController::class, 'createTransaction'])->name('inventory.transactions.create');
        Route::post('/transactions', [InventoryController::class, 'storeTransaction'])->name('inventory.transactions.store');
    });

    Route::prefix('qc')->group(function () {
        Route::get('/', [QcResultController::class, 'index'])->name('qc.index');
        Route::get('/create', [QcResultController::class, 'create'])->name('qc.create');
        Route::post('/', [QcResultController::class, 'store'])->name('qc.store');
    });

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('/shelf-life', [ShelfLifeController::class, 'index'])->name('shelf-life.index');

    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('settings.index');
        Route::match(['post', 'put'], '/', [SettingController::class, 'update'])->name('settings.update');
    });

    Route::prefix('export')->group(function () {
        Route::get('/csv/{type}', [ExportController::class, 'csv'])->name('export.csv');
        Route::get('/pdf/{type}', [ExportController::class, 'pdf'])->name('export.pdf');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
