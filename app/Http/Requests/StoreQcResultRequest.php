<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQcResultRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'milk_batch_id' => 'required_without:production_batch_id|exists:milk_batches,id|nullable',
            'production_batch_id' => 'required_without:milk_batch_id|exists:production_batches,id|nullable',
            'qc_type' => 'required|in:raw,pasteurized,mozzarella',
            'fat' => 'nullable|numeric|min:0|max:100',
            'snf' => 'nullable|numeric|min:0|max:100',
            'density' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0|max:100',
            'lactose' => 'nullable|numeric|min:0|max:100',
            'salts' => 'nullable|numeric|min:0|max:100',
            'total_solids' => 'nullable|numeric|min:0|max:100',
            'added_water' => 'nullable|numeric|min:0|max:100',
            'freezing_point' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
            'ph' => 'nullable|numeric|min:0|max:14',
            'peroxide' => 'nullable|string|max:20',
            'antibiotic' => 'nullable|string|max:20',
            'aroma' => 'nullable|string',
            'taste' => 'nullable|string',
            'texture' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
