<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSchoolYearRequest extends FormRequest
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
        $schoolYearID = $this->route('school_year')->SchoolYearID;

        return [
            'YearName' => 'sometimes|string|max:50|unique:schoolyear,YearName,' . $schoolYearID . ',SchoolYearID',
            'StartDate' => 'sometimes|date',
            'EndDate' => 'sometimes|date',
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $schoolYear = $this->route('school_year');

            if (!$schoolYear) {
                return;
            }

            // Use new input if available, otherwise use existing DB values
            $startDate = $this->input('StartDate', $schoolYear->StartDate);
            $endDate = $this->input('EndDate', $schoolYear->EndDate);

            // Compare values
            if ($startDate && $endDate && $startDate > $endDate) {
                $validator->errors()->add('StartDate', 'The Start Date must be before the End Date.');
                $validator->errors()->add('EndDate', 'The End Date must be after the Start Date.');
            }
        });
    }

}
