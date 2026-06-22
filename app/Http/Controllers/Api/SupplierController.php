<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;

class SupplierController extends Controller
{
    public function index() { return Supplier::all(); }
    public function show(Supplier $supplier) { return $supplier; }
    public function store(StoreSupplierRequest $request) { return Supplier::create($request->validated()); }
    public function update(UpdateSupplierRequest $request, Supplier $supplier) { $supplier->update($request->validated()); return $supplier; }
    public function destroy(Supplier $supplier) { $supplier->delete(); return response()->noContent(); }
}
