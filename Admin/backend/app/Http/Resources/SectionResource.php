<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'SectionID' => $this->SectionID,
            'GradeLevelID' => $this->GradeLevelID,
            'SchoolYearID' => $this->SchoolYearID,
            'SectionName' => $this->SectionName,
            'MaxCapacity' => $this->MaxCapacity,
            'CurrentEnrollment' => $this->CurrentEnrollment,
            'Adviser' => [
                'EmployeeNumber' => $this->adviserTeacher?->EmployeeNumber,
                'Specialization' => $this->adviserTeacher?->Specialization,
                'LastName' => $this->adviserTeacher?->profile?->LastName,
                'FirstName' => $this->adviserTeacher?->profile?->FirstName,
                'MiddleName' => $this->adviserTeacher?->profile?->MiddleName,
                'ProfilePictureURL' => $this->adviserTeacher?->profile?->ProfilePictureURL,
            ],
            'Students' => route('sections.students', ['section' => $this->SectionID]),
            'Schedule' => route('sections.schedule', ['section' => $this->SectionID]),
            'Attendance' => route('sections.attendance', ['section' => $this->SectionID]),
        ];
    }
}
