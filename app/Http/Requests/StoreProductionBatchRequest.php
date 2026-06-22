<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductionBatchRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'milk_batch_id' => 'required|exists:milk_batches,id',
            'production_type' => 'required|in:mozzarella,susu_cup',
            'start_time' => 'required|date',
            'notes' => 'nullable|string',
        ];
    }
}
