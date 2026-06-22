<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'supplier_code' => 'required|string|max:50|unique:suppliers,supplier_code,' . ($this->route('supplier')?->id ?? 'NULL'),
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
