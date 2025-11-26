<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\SchoolYearResource;
use App\Http\Requests\StoreSchoolYearRequest;
use App\Http\Requests\UpdateSchoolYearRequest;
use App\Http\Resources\SchoolYearPaginatedCollection;

class SchoolYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schoolYears = SchoolYear::with([
            'sections.adviserTeacher.profile'
        ])->orderBy('StartDate', 'desc')->paginate(1);

        // Manually load gradeLevels for each school year
        $schoolYears->each(function ($schoolYear) {
            $schoolYear->setRelation('gradeLevels', $schoolYear->gradeLevels()->get());
        });

        return new SchoolYearPaginatedCollection($schoolYears);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolYearRequest $request)
    {
        $CurrentSchoolYear = SchoolYear::getCurrentSchoolYear();

        return DB::transaction(function () use ($request, $CurrentSchoolYear) {
            // reject when a schoolyear is currently active(not past EndDate)
            if ($CurrentSchoolYear && $CurrentSchoolYear->EndDate > now()) {
                return response()->json([
                    'message' => 'Unable to start a new school year while another is active.'
                ], 409);
            }

            // set all to 'not' active before creating a new school year
            SchoolYear::where('IsActive', true)->update(['IsActive' => false]);

            // create and set to active
            $schoolYear = SchoolYear::create(array_merge(
                $request->validated(),
                ['IsActive' => true] 
            ));
             
            //Generate Log
            AuditLog::create([
                'TableName' => 'schoolyear',
                'RecordID' => $schoolYear->SchoolYearID,
                'Operation' => 'INSERT',
                'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                'OldValues' => null,
                'NewValues' => json_encode($schoolYear->toArray()),
                'IPAddress' => $request->ip(),
                'UserAgent' => $request->userAgent(),
                'Timestamp' => now(),
            ]);

            return response()->json([
                'message' => 'School Year created successfully.',
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolYear $schoolYear)
    {
        $schoolYear->load([
            'sections.adviserTeacher.profile'
        ]);

        // Manually load gradeLevels
        $schoolYear->setRelation('gradeLevels', $schoolYear->gradeLevels()->get());

        return new SchoolYearResource($schoolYear);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolYearRequest $request, SchoolYear $schoolYear)
    {
        // Old values before update
        $oldValues = json_encode($schoolYear->toArray());

        $schoolYear->update($request->validated());
             
        //Generate Log
        AuditLog::create([
            'TableName' => 'schoolyear',
            'RecordID' => $schoolYear->SchoolYearID,
            'Operation' => 'UPDATE',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => $oldValues,
            'NewValues' => json_encode($schoolYear->fresh()->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'School Year updated successfully.',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
