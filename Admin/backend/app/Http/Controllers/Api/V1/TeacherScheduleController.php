<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use App\Models\User;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;

class TeacherScheduleController extends Controller
{
    // List all pending schedules grouped by teacher - NO AUTH REQUIRED
    public function index()
    {
        // Get all pending schedules with proper relationships
        $schedules = ClassSchedule::with([
            'subject',
            'status',
            'teacherProfile.profile.user',
            'section.gradeLevel'
        ])
        ->where('ScheduleStatusID', 2) // 2 = Pending status
        ->get();

        // Find the HeadTeacher (user with UserType = 'HeadTeacher')
        // First get the user with HeadTeacher type
        $headTeacherUser = User::where('UserType', 'HeadTeacher')->first();

        $headTeacherInfo = null;

        if ($headTeacherUser) {
            // Now find the teacher profile that belongs to this user
            // TeacherProfile has ProfileID, and Profile has UserID
            $headTeacherProfile = TeacherProfile::whereHas('profile', function($query) use ($headTeacherUser) {
                $query->where('UserID', $headTeacherUser->UserID);
            })->with('profile')->first();

            if ($headTeacherProfile) {
                // Use the actual HeadTeacher from database
                $profile = $headTeacherProfile->profile;
                
                $headTeacherInfo = [
                    'TeacherID' => $headTeacherProfile->TeacherProfileID,
                    'FirstName' => $profile->FirstName,
                    'LastName' => $profile->LastName,
                    'Specialization' => $headTeacherProfile->Specialization,
                    'Email' => $headTeacherUser->EmailAddress,
                    'UserType' => $headTeacherUser->UserType,
                ];
            }
        }

        // If no HeadTeacher found, create a fallback
        if (!$headTeacherInfo) {
            $headTeacherInfo = [
                'TeacherID' => 0,
                'FirstName' => 'No',
                'LastName' => 'Head Teacher',
                'Specialization' => 'Head Teacher',
                'Email' => 'noreply@example.com',
                'UserType' => 'HeadTeacher',
            ];
        }

        // If no pending schedules, return empty response with head teacher info
        if ($schedules->isEmpty()) {
            return response()->json([
                'SubmittedBy' => $headTeacherInfo,
                'SchedulesByTeacher' => [],
                'TotalPendingSchedules' => 0,
                'TotalTeachers' => 0,
                'Message' => 'No pending schedules found'
            ]);
        }

        // Group schedules by the teacher they are assigned to
        $schedulesByTeacher = $schedules
            ->groupBy('TeacherProfileID')
            ->map(function ($teacherSchedules, $teacherId) {
                $teacherProfile = $teacherSchedules->first()->teacherProfile;
                $profile = $teacherProfile->profile;
                
                // Calculate unique subjects and sections for this teacher
                $uniqueSubjects = $teacherSchedules
                    ->pluck('subject.SubjectName')
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray();
                    
                $uniqueSections = $teacherSchedules
                    ->pluck('section.SectionName')
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray();

                return [
                    'TeacherID' => $teacherId,
                    'FirstName' => $profile->FirstName,
                    'LastName' => $profile->LastName,
                    'Specialization' => $teacherProfile->Specialization,
                    'Email' => $teacherProfile->profile->user->EmailAddress ?? null,
                    'TotalClasses' => $teacherSchedules->count(),
                    'Subjects' => $uniqueSubjects,
                    'Sections' => $uniqueSections,
                ];
            })->values();

        // Build final response
        $response = [
            'SubmittedBy' => $headTeacherInfo,
            'SchedulesByTeacher' => $schedulesByTeacher,
            'TotalPendingSchedules' => $schedules->count(),
            'TotalTeachers' => $schedulesByTeacher->count(),
            'Message' => 'Successfully retrieved pending schedules'
        ];

        return response()->json($response);
    }

    // Get detailed schedules for all teachers (for modal view) - NO AUTH REQUIRED
    public function show()
    {
        $schedules = ClassSchedule::with([
            'subject',
            'status',
            'teacherProfile.profile',
            'section.gradeLevel'
        ])
        ->where('ScheduleStatusID', 2)
        ->get();

        if ($schedules->isEmpty()) {
            return response()->json([], 200);
        }

        $grouped = $schedules->groupBy('TeacherProfileID')->map(function ($teacherSchedules, $teacherId) {
            $teacherProfile = $teacherSchedules->first()->teacherProfile;
            $profile = $teacherProfile->profile;

            return [
                'TeacherID' => $teacherId,
                'FirstName' => $profile->FirstName,
                'LastName' => $profile->LastName,
                'Specialization' => $teacherProfile->Specialization,
                'Schedules' => $teacherSchedules->map(fn($schedule) => [
                    'ScheduleID' => $schedule->ScheduleID,
                    'DayOfWeek' => $schedule->DayOfWeek,
                    'StartTime' => $schedule->StartTime,
                    'EndTime' => $schedule->EndTime,
                    'Subject' => $schedule->subject?->SubjectName,
                    'Status' => $schedule->status?->StatusName,
                    'RoomNumber' => $schedule->RoomNumber,
                    'Section' => $schedule->section?->SectionName,
                    'GradeLevel' => $schedule->section?->gradeLevel?->LevelName,
                ])->sortBy(['DayOfWeek', 'StartTime'])->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    // Get detailed schedules for a specific teacher - NO AUTH REQUIRED
    public function getByTeacherId($teacherId)
    {
        $schedules = ClassSchedule::with([
            'subject',
            'status',
            'teacherProfile.profile',
            'section.gradeLevel'
        ])
        ->where('ScheduleStatusID', 2)
        ->where('TeacherProfileID', $teacherId)
        ->get();

        if ($schedules->isEmpty()) {
            return response()->json([
                'TeacherID' => $teacherId,
                'Schedules' => [],
                'Message' => 'No pending schedules found for this teacher'
            ], 200);
        }

        $teacherProfile = $schedules->first()->teacherProfile;
        $profile = $teacherProfile->profile;

        $response = [
            'TeacherID' => $teacherId,
            'FirstName' => $profile->FirstName,
            'LastName' => $profile->LastName,
            'Specialization' => $teacherProfile->Specialization,
            'Schedules' => $schedules->map(fn($schedule) => [
                'ScheduleID' => $schedule->ScheduleID,
                'DayOfWeek' => $schedule->DayOfWeek,
                'StartTime' => $schedule->StartTime,
                'EndTime' => $schedule->EndTime,
                'Subject' => $schedule->subject?->SubjectName,
                'Status' => $schedule->status?->StatusName,
                'RoomNumber' => $schedule->RoomNumber,
                'Section' => $schedule->section?->SectionName,
                'GradeLevel' => $schedule->section?->gradeLevel?->LevelName,
            ])->sortBy(['DayOfWeek', 'StartTime'])->values(),
        ];

        return response()->json($response);
    }
    
    // Approve all pending schedules (for all teachers) - NO AUTH REQUIRED
    public function approveAll(Request $request)
    {
        // Log who is approving (optional)
        $approvedBy = $request->input('submittedBy', 'System');

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
                'ApprovedBy' => $approvedBy,
            ], 400);
        }

        // Otherwise approve all pending schedules - REMOVED UpdatedAt
        $updatedCount = ClassSchedule::where('ScheduleStatusID', 2)
            ->update([
                'ScheduleStatusID' => 1 // 1 = Approved status
            ]);

        return response()->json([
            'Message' => "All pending schedules have been approved successfully.",
            'ApprovedBy' => $approvedBy,
            'TotalApproved' => $updatedCount
        ], 200);
    }


    // Decline all pending schedules (for all teachers) - NO AUTH REQUIRED
    public function declineAll(Request $request)
    {
        // Log who is declining (optional)
        $declinedBy = $request->input('submittedBy', 'System');

        $pending = ClassSchedule::where('ScheduleStatusID', 2)->count();

        if ($pending === 0) {
            return response()->json(['Message' => 'No pending schedules found.'], 404);
        }

        // Update all pending schedules to declined - REMOVED UpdatedAt
        $updatedCount = ClassSchedule::where('ScheduleStatusID', 2)
            ->update([
                'ScheduleStatusID' => 3 // 3 = Declined status
            ]);

        return response()->json([
            'Message' => "All pending schedules have been declined successfully.",
            'DeclinedBy' => $declinedBy,
            'TotalDeclined' => $updatedCount
        ], 200);
    }
}