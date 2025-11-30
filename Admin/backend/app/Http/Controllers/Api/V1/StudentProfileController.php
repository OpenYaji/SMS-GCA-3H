<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\Guardian;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\StudentGradesResource;
use App\Http\Resources\StudentProfileResource;
use App\Http\Requests\StoreStudentProfileRequest;
use App\Http\Resources\StudentAttendanceResource;
use App\Http\Requests\UpdateStudentProfileRequest;

class StudentProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StudentProfile::with([
            'profile.user',
            'medicalInfo',
            'emergencyContact',
            'guardians'
        ]);

        // Archived students
        if ($request->has('archived')) {
            $archivedType = $request->archived;
            if ($archivedType === 'record') { // archived record only
                $query->whereIn('StudentStatus', ['Withdrawn', 'On Leave', 'Graduated'])
                      ->whereHas('profile.user', function ($userQuery) {
                          $userQuery->whereIn('AccountStatus', ['Active', 'PendingVerification']);
                      });
            } elseif ($archivedType === 'account') { //archived account only
                $query->where('StudentStatus', 'Enrolled')
                      ->whereHas('profile.user', function ($userQuery) {
                          $userQuery->whereIn('AccountStatus', ['Suspended', 'Inactive']);
                      });
            } elseif ($archivedType === 'both') { // both account AND record archived
                $query->whereIn('StudentStatus', ['Withdrawn', 'On Leave', 'Graduated'])
                      ->whereHas('profile.user', function ($userQuery) {
                          $userQuery->whereIn('AccountStatus', ['Suspended', 'Inactive']);
                      });
            }
        } else {
            // Enrolled and Active/Pending accounts
            $query->where('StudentStatus', 'Enrolled')
                  ->whereHas('profile.user', function ($userQuery) {
                     $userQuery->whereIn('AccountStatus', ['Active', 'PendingVerification']);
                  });
        }

        return StudentProfileResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentProfileRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentProfile $studentProfile)
    {
        return StudentProfileResource::make($studentProfile->load([
            'profile.user',
            'medicalInfo',
            'emergencyContact',
            'guardians'
        ]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentProfileRequest $request, StudentProfile $studentProfile)
    {
        // Old values before update
        $oldValues = json_encode(new StudentProfileResource($studentProfile));

        $validated = $request->validated();

        // Get profile and corresponding user
        $profile = $studentProfile->profile;
        $user = $profile->user;

        $profilePictureURL = $profile->ProfilePictureURL;
        if ($request->hasFile('ProfilePicture')) {
            // Delete old picture if exists
            if ($profile->ProfilePictureURL) {
                $oldPath = str_replace(asset('storage/'), '', $profile->ProfilePictureURL);
                Storage::disk('public')->delete($oldPath);
            }
            
            // Store new picture
            $path = $request->file('ProfilePicture')->store('profiles', 'public');
            $profilePictureURL = asset('storage/' . $path);
        }

        try {
            $updatedData = DB::transaction(function () use ($validated, $oldValues, $request, $profile, $user, $studentProfile, $profilePictureURL) {

                // Update user
                $user->update([
                    'EmailAddress' => $validated['EmailAddress'],
                ]);

                // Update profile
                $profile->update([
                    'FirstName' => $validated['FirstName'],
                    'LastName' => $validated['LastName'],
                    'MiddleName' => $validated['MiddleName'] ?? null,
                    'EncryptedPhoneNumber' => Crypt::encryptString($validated['PhoneNumber']),
                    'EncryptedAddress' => Crypt::encryptString($validated['Address']),
                    'ProfilePictureURL' => $profilePictureURL,
                ]);

                // Update student profile
                $studentProfile->update([  
                    'DateOfBirth' => $validated['DateOfBirth'],
                    'Gender' => $validated['Gender'],
                    'Nationality' => $validated['Nationality'],
                ]);

                // Update or create emergency contact
                $studentProfile->emergencyContact()->updateOrCreate(
                    [],
                    [
                        'ContactPerson' => $validated['ContactPerson'],
                        'EncryptedContactNumber' => Crypt::encryptString($validated['ContactNumber']),
                    ]
                );

                // Update or create medical info
                $studentProfile->medicalInfo()->updateOrCreate(
                    [],
                    [
                        'Height' => $validated['Height'],
                        'Weight' => $validated['Weight'],
                        'EncryptedAllergies' => Crypt::encryptString($validated['Allergies']),
                        'EncryptedMedicalConditions' => Crypt::encryptString($validated['MedicalConditions']),
                        'EncryptedMedications' => Crypt::encryptString($validated['Medications'])
                    ]
                );

                // Update guardians and pivot data
                if (!empty($validated['Guardians'])) {
                    foreach ($validated['Guardians'] as $g) {
                        if (isset($g['GuardianID']) && !empty($g['GuardianID'])) {
                            // Update existing guardian info (GuardianID exists due to validation)
                            Guardian::where('GuardianID', $g['GuardianID'])->update([
                                'FullName' => $g['FullName'],
                                'EncryptedPhoneNumber' => Crypt::encryptString($g['PhoneNumber']),
                                'EncryptedEmailAddress' => Crypt::encryptString($g['EmailAddress']),
                                'Occupation' => $g['Occupation'],
                                'WorkAddress' => $g['WorkAddress'],
                            ]);

                            $guardianId = $g['GuardianID'];
                        } else {
                            // Create new guardian (GuardianID is null or not provided)
                            $guardian = Guardian::create([
                                'FullName' => $g['FullName'],
                                'EncryptedPhoneNumber' => Crypt::encryptString($g['PhoneNumber']),
                                'EncryptedEmailAddress' => Crypt::encryptString($g['EmailAddress']),
                                'Occupation' => $g['Occupation'],
                                'WorkAddress' => $g['WorkAddress'],
                            ]);

                            $guardianId = $guardian->GuardianID;
                        }

                        // Update or create pivot record
                        $studentProfile->guardians()->syncWithoutDetaching([
                            $guardianId => [
                                'RelationshipType' => $g['RelationshipType'],
                                'IsPrimaryContact' => $g['IsPrimaryContact'],
                                'IsEmergencyContact' => $g['IsEmergencyContact'],
                                'IsAuthorizedPickup' => $g['IsAuthorizedPickup'],
                                'SortOrder' => $g['SortOrder'] ?? 1,
                            ]
                        ]);
                    }
                }
                
                //Generate Log
                AuditLog::create([
                    'TableName' => 'studentprofile',
                    'RecordID' => $studentProfile->StudentProfileID,
                    'Operation' => 'UPDATE',
                    'UserID' => User::getCurrentUserId(), 
                    'OldValues' => $oldValues,
                    'NewValues' => json_encode(new StudentProfileResource($studentProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return $studentProfile;
            });

            return response()->json([
                'message' => 'Student updated successfully',
                'data' => new StudentProfileResource($updatedData->fresh(['profile.user', 'emergencyContact', 'medicalInfo']))
            ], 200);

        } catch (\Throwable $e) {

            Log::error('Student update failed', ['error' => $e->getMessage()]);

            // Clean up the newly uploaded file
            if ($request->hasFile('ProfilePicture') && isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Student record update failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentProfile $studentProfile)
    {
        //
    }

    /**
     * Activate student account
     */
    public function activateAccount(Request $request, StudentProfile $studentProfile)
    {
        // Get profile and corresponding user
        $profile = $studentProfile->profile;
        $user = $profile->user;

        // Check if user have password record
        if ($user->passwordPolicy) {
            return response()->json([
                'message' => 'Student already has an activated account'
            ], 422);
        }

        $plainPassword = Str::random(10);

        // Create password
        $passwordPolicy = $user->passwordPolicy()->create([
            'UserID' => $user->UserID,
            'PasswordHash' => Hash::make($plainPassword),
            'PasswordSetDate' => now(),
        ]);

        $user->update(['AccountStatus' => 'Active']);

        //Generate Log
        AuditLog::create([
            'TableName' => 'passwordpolicy',
            'RecordID' => $passwordPolicy->PolicyID,
            'Operation' => 'INSERT',
            'UserID' => User::getCurrentUserId(), 
            'OldValues' => null,
            'NewValues' => json_encode($passwordPolicy->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        // Send to created user
        Mail::to($user->EmailAddress)->send(new AccountCreated($user, $plainPassword));

        return response()->json([
            'message'=> 'Student account activated successfully'
        ], 200);
    }

    /**
     * Bulk activate student accounts
     */
    public function bulkActivateAccounts(Request $request)
    {
        $request->validate([
            'StudentProfileIDs' => 'required|array',
            'StudentProfileIDs.*' => 'exists:StudentProfile,StudentProfileID'
        ]);

        $studentIds = $request->input('StudentProfileIDs');
        $results = [
            'Successful' => [],
            'Failed' => [],
            'AlreadyActivated' => []
        ];

        foreach ($studentIds as $studentId) {
            try {
                $studentProfile = StudentProfile::find($studentId);
                
                if (!$studentProfile) {
                    $results['Failed'][] = [
                        'StudentProfileID' => $studentId,
                        'Reason' => 'Student profile not found'
                    ];
                    continue;
                }

                $profile = $studentProfile->profile;
                $user = $profile->user;

                // Check if already activated
                if ($user->passwordPolicy) {
                    $results['AlreadyActivated'][] = [
                        'StudentProfileID' => $studentId,
                        'Email' => $user->EmailAddress
                    ];
                    continue;
                }

                $plainPassword = Str::random(10);

                // Create password
                $passwordPolicy = $user->passwordPolicy()->create([
                    'UserID' => $user->UserID,
                    'PasswordHash' => Hash::make($plainPassword),
                    'PasswordSetDate' => now(),
                ]);

                $user->update(['AccountStatus' => 'Active']);

                //Generate Log
                AuditLog::create([
                    'TableName' => 'passwordpolicy',
                    'RecordID' => $passwordPolicy->PolicyID,
                    'Operation' => 'INSERT',
                    'UserID' => User::getCurrentUserId(), 
                    'OldValues' => null,
                    'NewValues' => json_encode($passwordPolicy->toArray()),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                // Send email
                Mail::to($user->EmailAddress)->send(new AccountCreated($user, $plainPassword));

                $results['Successful'][] = [
                    'StudentProfileID' => $studentId,
                    'Email' => $user->EmailAddress
                ];

            } catch (\Exception $e) {
                $results['Failed'][] = [
                    'StudentProfileID' => $studentId,
                    'Reason' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'message' => 'Bulk activation completed',
            'data' => [
                'Results' => $results,
                'Summary' => [
                    'TotalProcessed' => count($studentIds),
                    'Successful' => count($results['Successful']),
                    'AlreadyActivated' => count($results['AlreadyActivated']),
                    'Failed' => count($results['Failed'])
                ]
            ],
        ], 200);
    }

    /**
     * Bulk archive student accounts
     */
    public function bulkArchiveAccounts(Request $request)
    {
        $request->validate([
            'StudentProfileIDs' => 'required|array',
            'StudentProfileIDs.*' => 'exists:StudentProfile,StudentProfileID',
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $studentIds = $request->input('StudentProfileIDs');
        $newAccountStatus = $request->input('AccountStatus');
        
        $results = [
            'Successful' => [],
            'Failed' => [],
            'AlreadyArchived' => []
        ];

        foreach ($studentIds as $studentId) {
            try {
                $studentProfile = StudentProfile::find($studentId);
                
                if (!$studentProfile) {
                    $results['Failed'][] = [
                        'StudentProfileID' => $studentId,
                        'Reason' => 'Student profile not found'
                    ];
                    continue;
                }

                $user = $studentProfile->profile->user;
                $currentAccountStatus = $user->AccountStatus;

                // Check if already has the target status
                if ($currentAccountStatus === $newAccountStatus) {
                    $results['AlreadyArchived'][] = [
                        'StudentProfileID' => $studentId,
                        'Email' => $user->EmailAddress,
                        'CurrentStatus' => $currentAccountStatus
                    ];
                    continue;
                }

                // Archive the account
                $user->update([
                    'IsDeleted' => true,
                    'AccountStatus' => $newAccountStatus
                ]);

                $results['Successful'][] = [
                    'StudentProfileID' => $studentId,
                    'Email' => $user->EmailAddress,
                    'PreviousStatus' => $currentAccountStatus,
                    'NewStatus' => $newAccountStatus
                ];

            } catch (\Exception $e) {
                $results['Failed'][] = [
                    'StudentProfileID' => $studentId,
                    'Reason' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'Message' => 'Bulk archive completed',
            'Data' => [
                'Results' => $results,
                'Summary' => [
                    'TotalProcessed' => count($studentIds),
                    'Successful' => count($results['Successful']),
                    'AlreadyArchived' => count($results['AlreadyArchived']),
                    'Failed' => count($results['Failed'])
                ]
            ],
        ], 200);
    }

    /*
     * Move student to another section
     */
    public function changeSection(Request $request, StudentProfile $studentProfile)
    {
        $validated = $request->validate([
            'NewSectionID' => 'required|exists:section,SectionID'
        ]);

        $studentProfile->enrollments()->latest('EnrollmentID')->first()->update([
            'SectionID' => $validated['NewSectionID']
        ]);

        return response()->json([
            'message'=> 'Student successfully moved to another section'
        ], 200);
    }

    /*
     * Archive student account and record
     */    
    public function archive(Request $request, StudentProfile $studentProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended',
            'StudentStatus' => 'required|in:Withdrawn,Graduated,On Leave'
        ]);

        try{
            DB::transaction(function() use ($validated, $studentProfile){
                $studentProfile->update([
                    'ArchiveDate' => now(),
                    'StudentStatus' => $validated['StudentStatus']
                ]);
        
                $studentProfile->profile->user->update([
                    'IsDeleted' => true,
                    'AccountStatus' => $validated['AccountStatus']
                ]);
            });

            return response()->json([
                'message' => 'Student archived successfully.',
            ], 200);

        } catch (\Throwable $e){

            Log::error('Student archive failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Student archive failed.',
            ], 500);
        }
    }

    public function unarchive(StudentProfile $studentProfile)
    {
        try{
            DB::transaction(function() use ($studentProfile){
                $studentProfile->update([
                    'ArchiveDate' => null,
                    'StudentStatus' => 'Enrolled'
                ]);
        
                $studentProfile->profile->user->update([
                    'IsDeleted' => false,
                    'AccountStatus' => 'Active'
                ]);
            });

            return response()->json([
                'message' => 'Student unarchived successfully.',
            ], 200);

        } catch (\Throwable $e){

            Log::error('Student unarchive failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Student unarchive failed.',
            ], 500);
        }
    }

    /*
     * Archive student account
     */    
    public function archiveAccount(Request $request, StudentProfile $studentProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $studentProfile->profile->user->update([
            'IsDeleted' => true,
            'AccountStatus' => $validated['AccountStatus']
        ]);

        return response()->json([
            'message' => 'Student archived successfully.',
        ], 200);
    }

    /*
     * Unarchive student account
     */    
    public function unarchiveAccount(StudentProfile $studentProfile)
    {
        $studentProfile->profile->user->update([
            'IsDeleted' => false,
            'AccountStatus' => 'Active'
        ]);

        return response()->json([
            'message' => 'Student unarchived successfully.',
        ], 200);
    }

    /*
     * Archive student record
     */  
    public function archiveRecord(Request $request, StudentProfile $studentProfile)
    {
        $validated = $request->validate([
            'StudentStatus' => 'required|in:Withdrawn,Graduated,On Leave'
        ]);

        $studentProfile->update([
            'ArchiveDate' => now(),
            'StudentStatus' => $validated['StudentStatus']
        ]);

        return response()->json([
            'message'=> 'Student record archived successfully'
        ], 200);
    }

    /*
     * Unarchive student record
     */  
    public function unarchiveRecord(StudentProfile $studentProfile)
    {
        $studentProfile->update([
            'ArchiveDate' => null,
            'StudentStatus' => 'Enrolled'
        ]);
        
        return response()->json([
            'message'=> 'Student record unarchived successfully'
        ], 200);
    }

    /*
     * Get grades of a student
     */  
    public function grades(StudentProfile $studentProfile)
    {
        $studentProfile->load([
            'profile',
            'enrollments.section.gradeLevel',
            'enrollments.section.schoolYear',
            'enrollments.grades.subject',
            'enrollments.grades.gradeStatus'
        ]);

        return new StudentGradesResource($studentProfile);
    }    

    /*
     * Get attendance of a student
     */ 
    public function attendance(Request $request, StudentProfile $studentProfile)
    {
        // Get period from request, default to 7 days
        $reportPeriod = $request->get('period', 7);
        $dataSince = now()->subDays($reportPeriod)->format('Y-m-d');

        $studentWithAttendances = $studentProfile->load([
            'profile',
            'attendances' => function ($query) use ($dataSince) {
                $query->where('AttendanceDate', '>=', $dataSince)
                    ->orderBy('AttendanceDate', 'desc')
                    ->orderBy('CheckInTime', 'desc');
            },
            'attendances.classSchedule.subject',
            'attendances.classSchedule.teacherProfile.profile',
            'attendances.attendanceMethod'
        ]);

        return new StudentAttendanceResource($studentWithAttendances);
    }

}
