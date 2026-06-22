<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryTransactionRequest;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\ProductionBatch;
use App\Services\AuditService;
use App\Services\InventoryService;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct(
        private InventoryService $inventoryService,
        private AuditService $auditService,
        private NotificationService $notificationService,
    ) {}

    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'products');
        $stock = $this->inventoryService->getAllStock();

        $products = array_filter($stock, fn($i) => in_array($i['category'], ['mozzarella', 'susu_cup']));
        $packaging = array_filter($stock, fn($i) => $i['category'] === 'packaging');

        return Inertia::render('Inventory/Index', [
            'tab' => $tab,
            'products' => array_values($products),
            'packaging' => array_values($packaging),
            'transactions' => InventoryTransaction::with('item', 'productionBatch')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
        ]);
    }

    public function createTransaction(): Response
    {
        return Inertia::render('Inventory/CreateTransaction', [
            'items' => InventoryItem::where('is_active', true)->orderBy('name')->get(),
            'productionBatches' => ProductionBatch::whereIn('status', ['ready', 'closed'])
                ->orderBy('created_at', 'desc')
                ->get(['id', 'batch_number', 'production_type']),
        ]);
    }

    public function storeTransaction(StoreInventoryTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['transaction_type'] === 'out') {
            $validated['quantity'] = -abs((float) $validated['quantity']);
        }

        $transaction = InventoryTransaction::create($validated);

        $item = InventoryItem::find($validated['item_id']);
        $this->auditService->log('inventory_transaction_created', 'inventory_transactions', $transaction->id, null, [
            'item' => $item?->name,
            'type' => $validated['transaction_type'],
            'qty' => $validated['quantity'],
        ]);

        $currentStock = $this->inventoryService->getCurrentStock($validated['item_id']);
        if ($item && $currentStock <= $item->minimum_stock) {
            $this->notificationService->create(
                type: 'inventory_warning',
                title: 'Stock Rendah: ' . $item->name,
                message: "Stok {$item->name} tersisa {$currentStock} {$item->unit} (min: {$item->minimum_stock})",
                notifiableType: 'App\Models\User',
                notifiableId: 1,
                data: ['item_id' => $item->id, 'current_stock' => $currentStock, 'minimum_stock' => $item->minimum_stock],
            );
        }

        return redirect()->route('inventory.index')->with('success', 'Transaksi inventory berhasil.');
    }

    public function items(): Response
    {
        return Inertia::render('Inventory/Items', [
            'items' => InventoryItem::orderBy('name')->paginate(20),
        ]);
    }

    public function storeItem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_code' => 'required|string|max:50|unique:inventory_items,item_code',
            'name' => 'required|string|max:255',
            'category' => 'required|in:mozzarella,susu_cup,packaging',
            'unit' => 'required|string|max:50',
            'minimum_stock' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $item = InventoryItem::create($validated);

        $this->auditService->log('inventory_item_created', 'inventory_items', $item->id, null, $validated);

        return redirect()->route('inventory.items')->with('success', 'Item berhasil ditambahkan.');
    }

    public function updateItem(Request $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $validated = $request->validate([
            'item_code' => 'required|string|max:50|unique:inventory_items,item_code,' . $inventoryItem->id,
            'name' => 'required|string|max:255',
            'category' => 'required|in:mozzarella,susu_cup,packaging',
            'unit' => 'required|string|max:50',
            'minimum_stock' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $old = $inventoryItem->toArray();
        $inventoryItem->update($validated);

        $this->auditService->log('inventory_item_updated', 'inventory_items', $inventoryItem->id, $old, $validated);

        return redirect()->route('inventory.items')->with('success', 'Item berhasil diupdate.');
    }

    public function destroyItem(InventoryItem $inventoryItem): RedirectResponse
    {
        $old = $inventoryItem->toArray();
        $inventoryItem->delete();

        $this->auditService->log('inventory_item_deleted', 'inventory_items', $inventoryItem->id, $old, null);

        return redirect()->route('inventory.items')->with('success', 'Item berhasil dihapus.');
    }
}
