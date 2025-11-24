<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;

class TeacherScheduleController extends Controller
{
    // List all pending schedules grouped by teacher
    public function index()
    {
        // Simulated head teacher ID
        $headTeacherID = 1;

        $schedules = ClassSchedule::with(['subject', 'status', 'teacherProfile.profile'])
        ->whereHas('status', fn($query) => $query->where('StatusID', 2))
        ->get();

        // Fetch all schedules that were "submitted" by this simulated head teacher
        // $schedules = ClassSchedule::with(['subject', 'status', 'teacherProfile.profile'])
        //     ->where('SubmittedByID', $headTeacherID) // just a dummy field for simulation
        //     ->get();

        // Hardcoded head teacher info for simulation
        $headTeacherInfo = [
            'TeacherID' => $headTeacherID,
            'FirstName' => 'Simulated',
            'LastName' => 'HeadTeacher',
            'Specialization' => 'Head Teacher'
        ];

        // Group schedules by the teacher they are assigned to
        $schedulesByTeacher = $schedules
            ->groupBy('TeacherProfileID')
            ->map(function ($teacherSchedules, $teacherId) {
                $teacherProfile = $teacherSchedules->first()?->teacherProfile;
                $profile = $teacherProfile?->profile;

                return [
                    'TeacherID' => $teacherId,
                    'FirstName' => $profile?->FirstName,
                    'LastName' => $profile?->LastName,
                    'Specialization' => $teacherProfile?->Specialization,
                    // 'Schedules' => $teacherSchedules->map(fn($schedule) => [
                    //     'ScheduleID' => $schedule->ScheduleID,
                    //     'DayOfWeek' => $schedule->DayOfWeek,
                    //     'StartTime' => $schedule->StartTime,
                    //     'EndTime' => $schedule->EndTime,
                    //     'Subject' => $schedule->subject?->SubjectName,
                    //     'Status' => $schedule->status?->StatusName,
                    // ])->values(),
                ];
            })->values();

        // Build final response
        $response = [
            'SubmittedBy' => $headTeacherInfo,
            'SchedulesByTeacher' => $schedulesByTeacher
        ];

        return response()->json($response);
    }



    // NOTE: API for the schedules per teacher

    // Show pending schedules for a specific teacher
    // public function show($teacherId)
    // {
    //     $schedules = ClassSchedule::with(['subject', 'status', 'teacherProfile.profile'])
    //         ->where('TeacherProfileID', $teacherId)
    //         ->where('ScheduleStatusID', 2)
    //         ->get();

    //     if ($schedules->isEmpty()) {
    //         return response()->json([
    //             'TeacherID' => $teacherId,
    //             'Message' => 'No pending schedules found for this teacher.',
    //         ], 404);
    //     }

    //     $teacherProfile = $schedules->first()->teacherProfile;
    //     $profile = $teacherProfile?->profile;

    //     return response()->json([
    //         'TeacherID' => $teacherId,
    //         'FirstName' => $profile?->FirstName,
    //         'LastName' => $profile?->LastName,
    //         'Schedules' => $schedules->map(fn($schedule) => [
    //             'ScheduleID' => $schedule->ScheduleID,
    //             'DayOfWeek' => $schedule->DayOfWeek,
    //             'StartTime' => $schedule->StartTime,
    //             'EndTime' => $schedule->EndTime,
    //             'Subject' => $schedule->subject?->SubjectName,
    //             'Status' => $schedule->status?->StatusName,
    //         ])->values(),
    //     ]);
    // }

    // NOTE: All Schedules for all teachers
    public function show()
    {
        $schedules = ClassSchedule::with(['subject', 'status', 'teacherProfile.profile'])
            ->whereHas('status', fn($query) => $query->where('StatusID', 2))
            ->get();

        $grouped = $schedules->groupBy('TeacherProfileID')->map(function ($teacherSchedules, $teacherId) {
            $teacherProfile = $teacherSchedules->first()->teacherProfile;
            $profile = $teacherProfile?->profile;

            return [
                'TeacherID' => $teacherId,
                'FirstName' => $profile?->FirstName,
                'LastName' => $profile?->LastName,
                'Subject' => $teacherProfile?->Specialization,
                'Schedules' => $teacherSchedules->map(fn($schedule) => [
                    'ScheduleID' => $schedule->ScheduleID,
                    'DayOfWeek' => $schedule->DayOfWeek,
                    'StartTime' => $schedule->StartTime,
                    'EndTime' => $schedule->EndTime,
                    'Subject' => $schedule->subject?->SubjectName,
                    'Status' => $schedule->status?->StatusName,
                ])->values(),
            ];
        })->values();

        return response()->json($grouped);
    }
    
    // Approve all pending schedules (for all teachers)
    public function approveAll()
    {
        // Get all pending schedules with related teacher, section, and grade level
        $pendingSchedules = ClassSchedule::with([
            'teacherProfile.profile',
            'section.gradeLevel'
        ])
        ->where('ScheduleStatusID', 2)
        ->get();

        if ($pendingSchedules->isEmpty()) {
            return response()->json(['Message' => 'No pending schedules found.'], 404);
        }

        // Group by DayOfWeek + StartTime + EndTime + SectionID
        $grouped = $pendingSchedules->groupBy(function ($schedule) {
            return "{$schedule->DayOfWeek}-{$schedule->StartTime}-{$schedule->EndTime}-{$schedule->SectionID}";
        });

        $conflicts = [];

        foreach ($grouped as $key => $schedules) {
            // Check if more than one teacher has the same section/time
            $uniqueTeachers = $schedules->pluck('TeacherProfileID')->unique();

            if ($uniqueTeachers->count() > 1) {
                $example = $schedules->first();

                $day = $example->DayOfWeek;
                $start = $example->StartTime;
                $end = $example->EndTime;

                $sectionName = $example->section?->SectionName ?? 'Unknown Section';
                $levelName = $example->section?->gradeLevel?->LevelName ?? 'Unknown Level';

                // Collect teacher names
                $teachers = $schedules->map(function ($s) {
                    $profile = $s->teacherProfile?->profile;
                    return $profile ? "{$profile->FirstName} {$profile->LastName}" : "Unknown Teacher";
                })->unique()->values();

                $conflicts[] = [
                    'DayOfWeek' => $day,
                    'StartTime' => $start,
                    'EndTime' => $end,
                    'LevelName' => $levelName,
                    'SectionName' => $sectionName,
                    'Teachers' => $teachers,
                ];
            }
        }

        // Return conflicts if found
        if (!empty($conflicts)) {
            return response()->json([
                'Message' => 'Cannot accept because of schedule conflict.',
                'Conflicts' => $conflicts,
            ], 400);
        }

        // Otherwise approve all pending schedules
        ClassSchedule::where('ScheduleStatusID', 2)
            ->update(['ScheduleStatusID' => 1]);

        return response()->json([
            'Message' => "All pending schedules have been approved successfully."
        ], 200);
    }


    // Decline all pending schedules (for all teachers)
    public function declineAll()
    {
        $pending = ClassSchedule::where('ScheduleStatusID', 2)->count();

        if ($pending === 0) {
            return response()->json(['Message' => 'No pending schedules found.'], 404);
        }

        ClassSchedule::where('ScheduleStatusID', 2)
            ->update(['ScheduleStatusID' => 3]);

        return response()->json([
            'Message' => "All pending schedules have been declined successfully."
        ], 200);
    }
}