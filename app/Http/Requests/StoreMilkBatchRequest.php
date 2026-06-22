<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMilkBatchRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'received_date' => 'required|date',
            'received_time' => 'required|date_format:H:i',
            'volume_liter' => 'required|numeric|min:0.01',
            'production_target' => 'required|in:mozzarella,susu_cup',
            'notes' => 'nullable|string',
        ];
    }
}
