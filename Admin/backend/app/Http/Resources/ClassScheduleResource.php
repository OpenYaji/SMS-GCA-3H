<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Sort schedules by day and start time
        $sortedSchedules = $this->classSchedules
            ->sortBy([
                fn ($a, $b) => collect(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])
                    ->search($a->DayOfWeek) <=> collect(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])
                    ->search($b->DayOfWeek),
                ['StartTime', 'asc']
            ]);

        // Group by day
        $groupedByDay = $sortedSchedules->groupBy('DayOfWeek')->map(function (Collection $daySchedules) {
            return $daySchedules->map(function ($schedule) {
                return [
                    'StartTime' => $schedule->StartTime,
                    'EndTime' => $schedule->EndTime,
                    'RoomNumber' => $schedule->RoomNumber,
                    'SubjectName' => $schedule->subject?->SubjectName,
                    'SubjectCode' => $schedule->subject?->SubjectCode,
                    'Teacher' => [
                        'LastName' => $schedule->teacherProfile?->profile?->LastName,
                        'FirstName' => $schedule->teacherProfile?->profile?->FirstName,
                        'MiddleName' => $schedule->teacherProfile?->profile?->MiddleName,
                    ],
                ];
            })->values();
        });

        return [
            'SectionID' => $this->SectionID,
            'Schedules' => $groupedByDay,
        ];
    }
}
