<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryTransactionRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'item_id' => 'required|exists:inventory_items,id',
            'transaction_type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|numeric|min:0.01',
            'production_batch_id' => 'nullable|exists:production_batches,id',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string',
            'request_by' => 'nullable|string|max:100',
            'no_sj' => 'nullable|string|max:100',
        ];
    }
}
