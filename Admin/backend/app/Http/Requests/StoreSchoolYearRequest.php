<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolYearRequest extends FormRequest
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
            'YearName' => 'required|string|max:50|unique:schoolyear,YearName',
            'StartDate' => 'required|date|after:today',
            'EndDate' => 'required|date|after:StartDate',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $start = $this->input('StartDate');
            $end = $this->input('EndDate');

            if ($start && $end) {
                $minEnd = \Carbon\Carbon::parse($start)->addMonths(9);
                if (\Carbon\Carbon::parse($end)->lt($minEnd)) {
                    $validator->errors()->add('EndDate', 'The end date must be at least 9 months after the start date.');
                }
            }
        });
    }
}
