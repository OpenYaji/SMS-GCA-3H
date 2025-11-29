<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolYearResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'SchoolYearID' => $this->SchoolYearID,
            'YearName' => $this->YearName,
            'StartDate' => $this->StartDate,
            'EndDate' => $this->EndDate,
            'IsActive' => $this->IsActive,

            'GradeLevels' => $this->whenLoaded('gradeLevels', function () {
                return GradeLevelResource::collection($this->gradeLevels);
            }),

            'GradeSubmissionDeadlines' => GradeSubmissionDeadlineResource::collection($this->gradeSubmissionDeadlines),
        ];
    }
}
