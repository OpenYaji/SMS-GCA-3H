<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Helpers\EncryptionHelper;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Contracts\Encryption\DecryptException;

class GuardProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'GuardProfileID' => $this->GuardProfileID ,
            'EmployeeNumber' => $this->EmployeeNumber,
            'HireDate' => $this->HireDate,

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
        ];
    }

 
}
