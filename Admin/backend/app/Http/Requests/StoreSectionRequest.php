<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSectionRequest extends FormRequest
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
            'GradeLevelID' => 'required|integer|exists:GradeLevel,GradeLevelID',
            'SchoolYearID' => 'required|integer|exists:SchoolYear,SchoolYearID',
            'AdviserTeacherID' => 'required|integer|exists:TeacherProfile,TeacherProfileID',
            'SectionName' => [
                'required',
                'string',
                'max:100',
                Rule::unique('Section')->where(function ($query) {
                    return $query->where('GradeLevelID', $this->GradeLevelID)
                                 ->where('SchoolYearID', $this->SchoolYearID);
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
