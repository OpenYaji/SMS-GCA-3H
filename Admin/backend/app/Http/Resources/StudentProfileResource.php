<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Helpers\EncryptionHelper;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Contracts\Encryption\DecryptException;

class StudentProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'StudentProfileID' => $this->StudentProfileID,
            'StudentNumber' => $this->StudentNumber,
            'QRCodeID' => $this->QRCodeID,
            'DateOfBirth' => $this->DateOfBirth,
            'Gender' => $this->Gender,
            'Nationality' => $this->Nationality,
            'StudentStatus' => $this->StudentStatus,
            'IsRecordArchived' => $this->ArchiveDate ? true : false,

            // include related profile details
            'Profile' => [
                'ProfileID' => $this->profile?->ProfileID,
                'FirstName' => $this->profile?->FirstName,
                'LastName' => $this->profile?->LastName,
                'MiddleName' => $this->profile?->MiddleName,
                'PhoneNumber' =>  EncryptionHelper::decrypt($this->profile?->EncryptedPhoneNumber),
                'Address' => EncryptionHelper::decrypt($this->profile?->EncryptedAddress),
                'ProfilePictureURL' => $this->profile?->ProfilePictureURL,
            ],

            // include related user details
            'User' => [
                'UserID' => $this->profile?->user?->UserID,
                'EmailAddress' => $this->profile?->user?->EmailAddress,
                'UserType' => $this->profile?->user?->UserType,
                'AccountStatus' => $this->profile?->user?->AccountStatus,
                'LastLoginDate' => $this->profile?->user?->LastLoginDate,
                // subject to change: field is named IsDeleted in db
                'IsArchived' => (bool) $this->profile?->user?->IsDeleted
            ],

            // include related student medical info
            'MedicalInfo' => [
                'Weight' => $this->medicalInfo?->Weight,
                'Height'=> $this->medicalInfo?->Height,
                'Allergies'=> EncryptionHelper::decrypt($this->medicalInfo?->EncryptedAllergies),
                'MedicalConditions'=> EncryptionHelper::decrypt($this->medicalInfo?->EncryptedMedicalConditions),
                'Medications'=> EncryptionHelper::decrypt($this->medicalInfo?->EncryptedMedications), 
            ],

            // include related student emergency contact
            'EmergencyContact' => [
                'ContactPerson'=> $this->emergencyContact?->ContactPerson,
                'ContactNumber'=> EncryptionHelper::decrypt($this->emergencyContact?->EncryptedContactNumber),
            ],

            'Guardians' => GuardianResource::collection($this->guardians),

            'AuthorizedEscorts' => AuthorizedEscortResource::collection($this->authorizedEscorts()->where('EscortStatus', 'Approved')->get()),

            'GradeLevel' => $this->enrollments()->orderByDesc('EnrollmentID')->first()?->section?->gradeLevel?->LevelName,
            'Section' => $this->enrollments()->orderByDesc('EnrollmentID')->first()?->section?->SectionName,

            'Grades' => route('student.grades', ['student_profile' => $this->StudentProfileID]),
            'Attendance' => route('student.attendance', ['student_profile' => $this->StudentProfileID]),
        ];
    }

 
}
