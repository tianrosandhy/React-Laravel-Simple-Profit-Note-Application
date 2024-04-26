<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateTransactionRequest extends FormRequest
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
            'wallet_id' => 'nullable|numeric',
            'label_id' => 'nullable|numeric',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'nullable|date',
            'type' => 'required|in:expense,income',
            'notes' => 'nullable|string',
        ];
    }
}
