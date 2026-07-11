<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function addItem(Request $request)
    {
        $data = $request->validate([
            'item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $po = session()->get('purchase_order', []);
        $itemId = $data['item_id'];
        $po[$itemId] = ($po[$itemId] ?? 0) + $data['quantity'];
        session()->put('purchase_order', $po);

        return redirect()->back()->with('success', 'Item ditambahkan ke Purchase Order.');
    }

    public function index()
    {
        $po = session()->get('purchase_order', []);
        $items = InventoryItem::whereIn('id', array_keys($po))->get()->keyBy('id');

        $itemsWithQty = collect($po)->map(fn($qty, $id) => [
            'item' => $items[(int)$id] ?? null,
            'quantity' => $qty,
        ])->filter(fn($i) => $i['item'] !== null)->values();

        return Inertia::render('Inventory/PurchaseOrder', [
            'poItems' => $itemsWithQty,
        ]);
    }

    public function save(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.qty' => 'required|integer|min:0',
        ]);

        $po = [];
        foreach ($data['items'] as $item) {
            if ($item['qty'] > 0) {
                $po[$item['id']] = $item['qty'];
            }
        }

        session()->put('purchase_order', $po);

        return redirect()->back()->with('success', 'Purchase Order tersimpan.');
    }

    public function clear()
    {
        session()->forget('purchase_order');
        return redirect()->back()->with('success', 'Purchase Order dibersihkan.');
    }

    public function banner()
    {
        $po = session()->get('purchase_order', []);
        if (empty($po)) {
            return response()->json(['items' => []]);
        }

        $items = InventoryItem::whereIn('id', array_keys($po))->get();
        return response()->json([
            'items' => $items->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'item_code' => $i->item_code,
                'quantity' => $po[$i->id],
            ]),
        ]);
    }
}
