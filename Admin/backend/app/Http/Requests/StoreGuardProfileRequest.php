<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuardProfileRequest extends FormRequest
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
            // User table fields
            'EmailAddress' => 'required|email|max:255|unique:user,EmailAddress',

            // Profile table fields
            'FirstName' => 'required|string|max:50',
            'LastName' => 'required|string|max:50',
            'MiddleName' => 'nullable|string|max:50',
            'PhoneNumber' => 'required|regex:/^\+?[0-9]{11,13}$/',
            'Address' => 'required|string|max:255',
            'ProfilePicture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            // GuardProfile table fields
            'HireDate' => 'nullable|date|before_or_equal:today',
        ];
    }
}
