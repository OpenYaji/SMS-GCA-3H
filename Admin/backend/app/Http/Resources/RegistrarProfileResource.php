<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Contracts\Encryption\DecryptException;

class RegistrarProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'RegistrarProfileID' => $this->RegistrarProfileID ,
            'EmployeeNumber' => $this->EmployeeNumber,
            'HireDate' => $this->HireDate,

            // include related profile details
            'Profile' => [
                'ProfileID' => $this->profile?->ProfileID,
                'FirstName' => $this->profile?->FirstName,
                'LastName' => $this->profile?->LastName,
                'MiddleName' => $this->profile?->MiddleName,
                'PhoneNumber' =>  $this->safeDecrypt($this->profile?->EncryptedPhoneNumber),
                'Address' => $this->safeDecrypt($this->profile?->EncryptedAddress),
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

    /**
     * Safely decrypts a given value.
     *
     * @param  string|null  $value
     * @return string|null
     */
    private function safeDecrypt(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        try {
            return Crypt::decryptString($value);
        } catch (DecryptException $e) {
            return null;
        }
    }
}
