<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthorizedEscortResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'EscortID' => $this->EscortID,
            // 'StudentProfileID' => $this->StudentProfileID,
            'FullName' => $this->FullName,
            'RelationshipToStudent' => $this->RelationshipToStudent,
            'ContactNumber' => $this->ContactNumber,
            'Address' => $this->Address,
            'AdditionalNotes' => $this->AdditionalNotes,
            'EscortStatus' => $this->EscortStatus,
            'IsActive' => $this->IsActive,
            'DateAdded' => $this->DateAdded,
            'ApprovedByUserID' => $this->ApprovedByUserID,
            'Student' => $this->whenLoaded('studentProfile', function (){
                return [
                'StudentProfileID' => $this->studentProfile->StudentProfileID,
                'FirstName' => $this->studentProfile->profile->FirstName,
                'LastName' => $this->studentProfile->profile->LastName,
                'MiddleName' => $this->studentProfile->profile->MiddleName,
                'GradeLevel' => $this->studentProfile->enrollments()?->orderByDesc('EnrollmentID')->first()?->section?->gradeLevel?->LevelName,
                'Section' => $this->studentProfile->enrollments()?->orderByDesc('EnrollmentID')->first()?->section?->SectionName,
                ];
            }),
        ];
    }
}
