<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionAttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Group attendances by date, then by class schedule
        $groupedAttendances = $this->attendances->groupBy('AttendanceDate')
            ->map(function ($dayAttendances, $date) {
                // Group by class schedule within each day
                $classes = $dayAttendances->groupBy('ClassScheduleID')
                    ->map(function ($classAttendances, $scheduleId) {
                        $firstAttendance = $classAttendances->first();
                        $classSchedule = $firstAttendance->classSchedule;
                        $teacherProfile = $classSchedule->teacherProfile ?? null;
                        
                        return [
                            'ClassInfo' => [
                                'Subject' => $classSchedule && $classSchedule->subject 
                                    ? $classSchedule->subject->SubjectName 
                                    : null,
                                'TimeStart' => $classSchedule->StartTime ?? null,
                                'TimeEnd' => $classSchedule->EndTime ?? null,
                                'Room' => $classSchedule->RoomNumber ?? null,
                                'Teacher' => $teacherProfile && $teacherProfile->profile ? [
                                    'TeacherProfileID' => $teacherProfile->TeacherProfileID,
                                    'FirstName' => $teacherProfile->profile->FirstName,
                                    'LastName' => $teacherProfile->profile->LastName,
                                    'MiddleName' => $teacherProfile->profile->MiddleName,
                                ] : null,
                            ],
                            'StudentAttendances' => $classAttendances->map(function ($attendance) {
                                $profile = $attendance->studentProfile->profile;
                                
                                return [
                                    'StudentNumber' => $attendance->studentProfile->StudentNumber,
                                    'LastName' => $profile->LastName,
                                    'FirstName' => $profile->FirstName,
                                    'MiddleName' => $profile->MiddleName,
                                    'Status' => $attendance->AttendanceStatus,
                                    'CheckIn' => $attendance->CheckInTime,
                                    'CheckOut' => $attendance->CheckOutTime,
                                    'Method' => $attendance->attendanceMethod->MethodName ?? null,
                                    'Notes' => $attendance->Notes,
                                ];
                            })->sortBy('LastName')
                              ->sortBy('FirstName')
                              ->values()
                        ];
                    })->sortBy(function ($class) {
                        return $class['ClassInfo']['TimeStart'] ?? '';
                    })->values();

                return [
                    'Date' => $date,
                    'Classes' => $classes
                ];
            })
            ->sortByDesc('Date')
            ->values();

        return [
            // Section Information
            'Section' => [
                'SectionID' => $this->SectionID,
                'SectionName' => $this->SectionName,
                'GradeLevel' => $this->gradeLevel->LevelName ?? null,
                'SchoolYear' => $this->schoolYear->YearName ?? null,
                'Adviser' => $this->adviserTeacher && $this->adviserTeacher->profile ? [
                    'TeacherProfileID' => $this->adviserTeacher->TeacherProfileID,
                    'LastName' => $this->adviserTeacher->profile->LastName,
                    'FirstName' => $this->adviserTeacher->profile->FirstName,
                    'MiddleName' => $this->adviserTeacher->profile->MiddleName,
                ] : null,
            ],

            // Organized Attendance Data
            'AttendanceByDate' => $groupedAttendances,

            // Overall Summary
            'Summary' => [
                'TotalDays' => $groupedAttendances->count(),
                'TotalAttendanceRecords' => $this->attendances->count(),
                'AttendanceBreakdown' => [
                    'Present' => $this->attendances->where('AttendanceStatus', 'Present')->count(),
                    'Late' => $this->attendances->where('AttendanceStatus', 'Late')->count(),
                    'Absent' => $this->attendances->where('AttendanceStatus', 'Absent')->count(),
                    'Excused' => $this->attendances->where('AttendanceStatus', 'Excused')->count(),
                ],
                'UniqueStudents' => $this->attendances->unique('StudentProfileID')->count(),
            ],
        ];
    }
}