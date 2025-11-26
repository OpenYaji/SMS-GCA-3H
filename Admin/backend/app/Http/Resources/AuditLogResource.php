<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Profile;

class AuditLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        // Map raw operations to human-readable actions
        $actionMap = [
            'INSERT' => 'Inserted a new entry into',
            'UPDATE' => 'Updated an entry in',
            'DELETE' => 'Deleted an entry from',
            'LOGIN'  => 'Logged in',
            'LOGOUT' => 'Logged out',
        ];

    return [
        'UserID'    => $this->UserID,
        'FirstName' => Profile::where('UserID', $this->UserID)->value('FirstName'),
        'LastName'  => Profile::where('UserID', $this->UserID)->value('LastName'),
        'Action'    => $actionMap[$this->Operation] ?? $this->Operation,
        'TableName' => in_array($this->Operation, ['LOGIN', 'LOGOUT']) ? null : $this->TableName,
        'Timestamp' => $this->Timestamp,
    ];
    }
}
