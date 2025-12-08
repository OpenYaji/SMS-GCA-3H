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
            'FirstName' => 'sometimes|string|max:100',
            'LastName' => 'sometimes|string|max:100',
            'MiddleName' => 'nullable|string|max:100',
            'PhoneNumber' => 'nullable|string|max:20',
            'Address' => 'nullable|string|max:500',
            'Gender' => 'nullable|in:Male,Female',
            'BirthDate' => 'nullable|date',
            'Age' => 'nullable|integer|min:0|max:150',
            'EmailAddress' => 'sometimes|email|max:255',
            'ProfilePictureURL' => 'nullable|string|max:2048',
            'ProfilePicture' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // max 5MB
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ProfilePicture.image' => 'The profile picture must be an image file.',
            'ProfilePicture.mimes' => 'The profile picture must be a file of type: jpeg, jpg, png, gif, webp.',
            'ProfilePicture.max' => 'The profile picture must not be larger than 5MB.',
        ];
    }
}