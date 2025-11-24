<?php

namespace App\Http\Resources;

use App\Helpers\EncryptionHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;

class GuardianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'GuardianID' => $this->GuardianID,
            'FullName' => $this->FullName,
            'PhoneNumber' => EncryptionHelper::decrypt($this->EncryptedPhoneNumber),
            'EmailAddress' => EncryptionHelper::decrypt($this->EncryptedEmailAddress),
            'Occupation' => $this->Occupation,
            'WorkAddress' => $this->WorkAddress,

            //Pivot fields from StudentGuardian
            'RelationshipType' => $this->pivot->RelationshipType,
            'IsPrimaryContact' => (bool) $this->pivot->IsPrimaryContact,
            'IsEmergencyContact' => (bool) $this->pivot->IsEmergencyContact,
            'IsAuthorizedPickup' => (bool) $this->pivot->IsAuthorizedPickup,
            'SortOrder' => $this->pivot->SortOrder,
        ];
    }
}
