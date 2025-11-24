<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherProfileRequest extends FormRequest
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
        $teacherProfile = $this->route('teacher_profile');// passed teacher based on the param name
        $userId = $teacherProfile?->profile?->user?->UserID;

        return [
            // User table fields
            'EmailAddress' => "required|email|max:255|unique:user,EmailAddress,{$userId},UserID",

            // Profile table fields
            'FirstName' => 'required|string|max:50',
            'LastName' => 'required|string|max:50',
            'MiddleName' => 'nullable|string|max:50',
            'PhoneNumber' => 'required|regex:/^\+?[0-9]{11,13}$/',
            'Address' => 'required|string|max:255',
            'ProfilePicture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            // TeacherProfile table fields
            'Specialization' => 'nullable|string|max:100',
            'HireDate' => 'nullable|date|before_or_equal:today',
        ];
    }
}
