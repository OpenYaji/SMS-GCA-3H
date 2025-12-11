<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCurrentUserRequest extends FormRequest
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
            'EmailAddress' => 'required|email|max:255',

            // Profile table fields
            'FirstName' => 'required|string|max:50',
            'LastName' => 'required|string|max:50',
            'MiddleName' => 'nullable|string|max:50',
            'PhoneNumber' => 'required|string|max:20',
            'Address' => 'required|string|max:255',
            'ProfilePictureURL' => 'nullable|url|max:2048',
        ];
    }
}
