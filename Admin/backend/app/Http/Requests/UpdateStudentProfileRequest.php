<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentProfileRequest extends FormRequest
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
        $studentProfile = $this->route('student_profile');// passed student based on the param name
        $userId = $studentProfile?->profile?->user?->UserID;

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

            // StudentProfile table fields
            'DateOfBirth' => 'nullable|date|before:today',
            'Gender' => 'nullable|string|max:20',
            'Nationality' => 'nullable|string|max:100',

            // EmergencyContact table fields
            'ContactPerson' => 'required|string|max:200',
            'ContactNumber' => 'required|numeric|digits_between:11,13',

            // MedicalInfo table fields
            'Height' => 'nullable|numeric',
            'Weight' => 'nullable|numeric',
            'Allergies' => 'nullable|string|max:100',
            'MedicalConditions' => 'nullable|string|max:100',
            'Medications' => 'nullable|string|max:100',

            /*
            * Guardian table fields
            * guardians are submitted as array
            */
            'Guardians' => 'nullable|array',
            'Guardians.*.GuardianID' => 'nullable|integer|exists:Guardian,GuardianID', // Nullable for new guardians
            'Guardians.*.FullName' => 'required|string|max:255',
            'Guardians.*.PhoneNumber' => 'required|string|max:50',
            'Guardians.*.EmailAddress' => 'required|email|max:255',
            'Guardians.*.Occupation' => 'nullable|string|max:255',
            'Guardians.*.WorkAddress' => 'nullable|string|max:255',
            // Pivot(studentguardians) table fields
            'Guardians.*.RelationshipType' => 'required|string|in:Father,Mother,Guardian,Sibling,Other',
            'Guardians.*.IsPrimaryContact' => 'required|boolean',
            'Guardians.*.IsEmergencyContact' => 'required|boolean',
            'Guardians.*.IsAuthorizedPickup' => 'required|boolean',
            'Guardians.*.SortOrder' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'Guardians.*.GuardianID.exists' => 'The selected guardian does not exist.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Convert empty GuardianID to null for new guardians
        if ($this->has('Guardians')) {
            $guardians = $this->Guardians;
            
            // Handle JSON string input from form-data
            if (is_string($guardians)) {
                $guardians = json_decode($guardians, true);
                
                // If JSON decoding fails, set to empty array
                if (json_last_error() !== JSON_ERROR_NONE || $guardians === null) {
                    $guardians = [];
                }
            }
            
            // Only process if we have a valid array
            if (is_array($guardians) && !empty($guardians)) {
                foreach ($guardians as &$guardian) {
                    if (isset($guardian['GuardianID']) && empty($guardian['GuardianID'])) {
                        $guardian['GuardianID'] = null;
                    }
                }
                $this->merge(['Guardians' => $guardians]);
            } else {
                // Set to empty array if invalid data
                $this->merge(['Guardians' => []]);
            }
        }
    }
}
