<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeSubmissionDeadlineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'DeadlineID' => $this->DeadlineID,
            'SchoolYearID' => $this->SchoolYearID,
            'Quarter' => $this->Quarter,
            'StartDate' => $this->StartDate,
            'DeadlineDate' => $this->DeadlineDate,
            'CreatedByUserID' => $this->CreatedByUserID,
        ];
    }
}
