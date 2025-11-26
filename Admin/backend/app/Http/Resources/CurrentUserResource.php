<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrentUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    
    public function authorize(): bool
    {
        return true;
    }

    public function toArray(Request $request): array
    {
        return [
            'ProfileID' => $this->ProfileID,
            'FirstName' => $this->profile?->FirstName,
            'LastName' => $this->profile?->LastName,
            'MiddleName' => $this->profile?->MiddleName,
            'PhoneNumber' => $this->profile?->EncryptedPhoneNumber 
                ? Crypt::decryptString($this->profile->EncryptedPhoneNumber) 
                : null,
            'Address' => $this->profile?->EncryptedAddress 
                ? Crypt::decryptString($this->profile->EncryptedAddress) 
                : null,
            'ProfilePictureURL' => $this->profile?->ProfilePictureURL,

            'User' => [
                'UserID' => $this->profile?->user?->UserID ?? null,
                'EmailAddress' => $this->profile?->user?->EmailAddress ?? null,
                'AccountStatus' => $this->profile?->user?->AccountStatus ?? null
            ],
        ];
    }

}