<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionRequest extends FormRequest
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
        $section = $this->route('section');
        
        return [
            'AdviserTeacherID' => 'integer|exists:TeacherProfile,TeacherProfileID',
            'SectionName' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('Section')->where(function ($query) use ($section) {
                    // Use the existing section's GradeLevelID and SchoolYearID
                    // since they're not being updated
                    return $query->where('GradeLevelID', $section->GradeLevelID)
                                 ->where('SchoolYearID', $section->SchoolYearID)
                                 ->where('SectionID', '!=', $section->SectionID);
                })
            ],
            'MaxCapacity' => 'integer|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'SectionName.unique' => 'A section with this name already exists for this grade level and school year.',
        ];
    }
}
