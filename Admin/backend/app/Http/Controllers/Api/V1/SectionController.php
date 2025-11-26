<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Section;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use App\Models\ScheduleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Http\Resources\ClassScheduleResource;
use App\Http\Resources\StudentProfileResource;
use App\Http\Resources\SectionAttendanceResource;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectionRequest $request)
    {
        $section = Section::create($request->validated());
 
        //Generate Log
        AuditLog::create([
            'TableName' => 'section',
            'RecordID' => $section->SectionID,
            'Operation' => 'INSERT',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => null,
            'NewValues' => json_encode($section->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Section created successfully.'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSectionRequest $request, Section $section)
    {
        // Old values before update
        $oldValues = json_encode($section->toArray());

        $section->update($request->validated());

        //Generate Log
        AuditLog::create([
            'TableName' => 'section',
            'RecordID' => $section->SectionID,
            'Operation' => 'UPDATE',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => $oldValues,
            'NewValues' => json_encode($section->fresh()->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Section updated successfully.'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * 
     * Display the corresponding students for a section
     */
    public function students(Section $section)
    {
        $section->load('enrollments.studentProfile.profile');

        $students = $section->enrollments
            ->pluck('studentProfile')
            ->filter(); // remove nulls if any

        if ($students->isEmpty()) {
            return response()->json([
                'message' => 'No students are enrolled in this section.',
                'data' => [],
            ], 200);
        }

        return StudentProfileResource::collection($students);
    }

    /**
     * Display only the schedule of the specified section
     */
    public function schedule(Section $section)
    {
        $statusId = ScheduleStatus::APPROVED;

        // Load schedules filtered by status
        $section->load([
            'classSchedules' => function ($query) use ($statusId) {
                $query->where('ScheduleStatusID', $statusId)
                      ->with(['subject', 'teacherProfile.profile']);
            }
        ]);

        if ($section->classSchedules->isEmpty()) {
            return response()->json([
                'message' => 'No assigned schedule found for this section.',
                'data' => [],
            ], 200);
        }

        return new ClassScheduleResource($section);
    }

    /**
     * Display all attendances for a specific section.
     */
    public function attendance(Request $request, Section $section)
    {
        // Get period from request, default to 7 days
        $reportPeriod = $request->get('period', 7);
        $dataSince = now()->subDays($reportPeriod)->format('Y-m-d');

        $sectionWithAttendances = $section->load([
            'gradeLevel',
            'schoolYear',
            'adviserTeacher.profile', // For section adviser
            'attendances' => function ($query) use ($dataSince) {
                $query->where('AttendanceDate', '>=', $dataSince)
                    ->orderBy('AttendanceDate', 'desc');
            },
            'attendances.studentProfile.profile',
            'attendances.classSchedule.subject',
            'attendances.classSchedule.teacherProfile.profile', // For subject teacher
            'attendances.attendanceMethod'
        ]);

        return new SectionAttendanceResource($sectionWithAttendances);
    }
}
