<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GradeSubmissionDeadline;
use Grade;

class GradeSubmissionDeadlineController extends Controller
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'SchoolYearID' => 'required|exists:SchoolYear,SchoolYearID',
            'Quarter' => 'required|in:First Quarter,Second Quarter,Third Quarter,Fourth Quarter',
            'StartDate' => 'required|date',
            'DeadlineDate' => 'required|date',
        ]);

        // Check if deadline already exists for this school year and quarter
        $existingDeadline = GradeSubmissionDeadline::where([
            'SchoolYearID' => $validated['SchoolYearID'],
            'Quarter' => $validated['Quarter']
        ])->exists();

        if ($existingDeadline) {
            return response()->json([
                'message' => 'A deadline for this school year and quarter already exists.'
            ], 422);
        }

        GradeSubmissionDeadline::create(array_merge(
            $validated,
            ['CreatedByUserID' => User::SYSTEM_USER_ID]
        ));

        return response()->json([
            'message' => 'Grade submission deadline created successfully.'
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
    public function update(Request $request, GradeSubmissionDeadline $gradeSubmissionDeadline)
    {
        $validated = $request->validate([
            'StartDate' => 'required|date',
            'DeadlineDate' => 'required|date',
        ]);

        $gradeSubmissionDeadline->update($validated);

        return response()->json([
            'message' => 'Grade submission deadline updated successfully.'
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
