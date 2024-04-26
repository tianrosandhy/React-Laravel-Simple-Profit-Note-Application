<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'nullable|numeric',
            'per_page' => 'nullable|numeric',
            'wallet_id' => 'nullable|numeric',
            'label_id' => 'nullable|numeric',
            'start_transaction_date' => 'nullable|date',
            'end_transaction_date' => 'nullable|date',
        ];
    }
}
