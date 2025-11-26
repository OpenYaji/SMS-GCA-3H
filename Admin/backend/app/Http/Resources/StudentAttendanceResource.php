<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentAttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $attendances = $this->attendances ?? collect();

        return [
            'data' => [
                'Student' => [
                    'StudentProfileID' => $this->StudentProfileID,
                    'StudentNumber' => $this->StudentNumber,
                    'LastName' => $this->profile->LastName ?? null,
                    'FirstName' => $this->profile->FirstName ?? null,
                    'MiddleName' => $this->profile->MiddleName ?? null,
                ],
                'AttendanceByDate' => $this->formatAttendanceByDate($attendances),
                'Summary' => $this->getSummary($attendances),
            ]
        ];
    }

    /**
     * Format attendance grouped by date
     */
    protected function formatAttendanceByDate($attendances)
    {
        return $attendances->groupBy('AttendanceDate')->map(function ($dayAttendances, $date) {
            return [
                'Date' => $date,
                'Classes' => $dayAttendances->map(function ($attendance) {
                    $classSchedule = $attendance->classSchedule;
                    
                    return [
                        'ClassInfo' => [
                            'Subject' => $classSchedule->subject->SubjectName ?? null,
                            'TimeStart' => $classSchedule->StartTime ?? null,
                            'TimeEnd' => $classSchedule->EndTime ?? null,
                            'Room' => $classSchedule->RoomNumber ?? null,
                            'Teacher' => $classSchedule->teacherProfile ? [
                                'TeacherProfileID' => $classSchedule->teacherProfile->TeacherProfileID,
                                'FirstName' => $classSchedule->teacherProfile->profile->FirstName ?? null,
                                'LastName' => $classSchedule->teacherProfile->profile->LastName ?? null,
                                'MiddleName' => $classSchedule->teacherProfile->profile->MiddleName ?? null,
                            ] : null
                        ],
                        'Attendance' => [
                            'Status' => $attendance->AttendanceStatus,
                            'CheckIn' => $attendance->CheckInTime,
                            'CheckOut' => $attendance->CheckOutTime,
                            'Method' => $attendance->attendanceMethod->MethodName ?? null,
                            'Notes' => $attendance->Notes,
                        ]
                    ];
                })
            ];
        })->values();
    }

    /**
     * Get attendance summary
     */
    protected function getSummary($attendances)
    {
        $uniqueDates = $attendances->pluck('AttendanceDate')->unique();

        return [
            'TotalDays' => $uniqueDates->count(),
            'TotalClasses' => $attendances->count(),
            'AttendanceBreakdown' => [
                'Present' => $attendances->where('AttendanceStatus', 'Present')->count(),
                'Late' => $attendances->where('AttendanceStatus', 'Late')->count(),
                'Absent' => $attendances->where('AttendanceStatus', 'Absent')->count(),
                'Excused' => $attendances->where('AttendanceStatus', 'Excused')->count(),
            ],
        ];
    }
}