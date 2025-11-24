<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
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
            'Title' => 'required|string|max:255',
            'Content' => 'required|string',
            'Summary' => 'nullable|string|max:500',
            'Category' => 'required|in:Academic,Events,General',
            'PublishDate' => 'required|date',
            'ExpiryDate' => 'nullable|date|after:PublishDate',
            'TargetAudience' => 'required|in:All Users,Students,Teachers,Parents,Staff',
            'IsPinned' => 'boolean',
            'IsActive' => 'boolean',
            'Banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
