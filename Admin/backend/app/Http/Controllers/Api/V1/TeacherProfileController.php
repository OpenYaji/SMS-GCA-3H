<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Profile;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use Illuminate\Http\Request;
use App\Models\PasswordPolicy;
use App\Models\TeacherProfile;
use App\Helpers\EncryptionHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\TeacherProfileResource;
use App\Http\Requests\StoreTeacherProfileRequest;
use App\Http\Requests\UpdateTeacherProfileRequest;

class TeacherProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TeacherProfileResource::collection(TeacherProfile::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherProfileRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('ProfilePicture')) {
            // Store profile in storage/app/public/profiles
            $path = $request->file('ProfilePicture')->store('profiles', 'public');
            $validated['ProfilePictureURL'] = asset('storage/' . $path); // include the public URL
        }

        $plainPassword = Str::random(10);

        try {
            $teacherData = DB::transaction(function () use ($validated, $request, $plainPassword) {
                // Create user
                $user = User::create([
                    'EmailAddress' => $validated['EmailAddress'],
                    'UserType' => $validated['UserType'],                    
                    'AccountStatus' => 'Active'
                ]);

                // Create password
                PasswordPolicy::create([
                    'UserID' => $user->UserID,
                    'PasswordHash' => Hash::make($plainPassword),
                    'PasswordSetDate' => now(),
                ]);

                // Create profile
                $profile = Profile::create([
                    'UserID' => $user->UserID,
                    'FirstName' => $validated['FirstName'],
                    'LastName' => $validated['LastName'],
                    'MiddleName' => $validated['MiddleName'],
                    'EncryptedPhoneNumber' => EncryptionHelper::encrypt($validated['PhoneNumber']),
                    'EncryptedAddress' => EncryptionHelper::encrypt($validated['Address']),
                    'ProfilePictureURL' => $validated['ProfilePictureURL'] ?? null,
                ]);

                // Create teacher profile
                $teacherProfile = TeacherProfile::create([
                    'ProfileID' => $profile->ProfileID,
                    'Specialization' => $validated['Specialization'] ?? null,
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);

                // Generate teacher employee number
                $teacherProfile->EmployeeNumber = 'T-' . str_pad($teacherProfile->TeacherProfileID, 5, '0', STR_PAD_LEFT);
                $teacherProfile->save();

                //Generate Log
                AuditLog::create([
                    'TableName' => 'teacherprofile',
                    'RecordID' => $teacherProfile->TeacherProfileID,
                    'Operation' => 'INSERT',
                    'UserID' => User::getCurrentUserId(), 
                    'OldValues' => null,
                    'NewValues' => json_encode(new TeacherProfileResource($teacherProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'teacherProfile');
            });

            // Send to created user
            Mail::to($teacherData['user']->EmailAddress)->send(new AccountCreated($teacherData['user'], $plainPassword));

            return response()->json([
                'message' => 'Teacher created successfully',
                'data' => new TeacherProfileResource($teacherData['teacherProfile'])
            ], 201);

        } catch (\Throwable $e) {
            
            Log::error('Teacher creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Teacher account creation failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TeacherProfile $teacherProfile)
    {
        return TeacherProfileResource::make($teacherProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherProfileRequest $request, TeacherProfile $teacherProfile)
    {
        // Old values before update
        $oldValues = json_encode(new TeacherProfileResource($teacherProfile));

        $validated = $request->validated();

        // Get profile and corresponding user
        $profile = $teacherProfile->profile;
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
            $updatedData = DB::transaction(function () use ($validated, $request, $oldValues, $profile, $user, $teacherProfile, $profilePictureURL) {

                // Update user
                $user->update([
                    'EmailAddress' => $validated['EmailAddress'],
                ]);

                // Update profile
                $profile->update([
                    'FirstName' => $validated['FirstName'],
                    'LastName' => $validated['LastName'],
                    'MiddleName' => $validated['MiddleName'] ?? null,
                    'EncryptedPhoneNumber' => EncryptionHelper::encrypt($validated['PhoneNumber']),
                    'EncryptedAddress' => EncryptionHelper::encrypt($validated['Address']),
                    'ProfilePictureURL' => $profilePictureURL,
                ]);

                // Update teacher profile
                $teacherProfile->update([
                    'Specialization' => $validated['Specialization'] ?? null,
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);
                
                //Generate Log
                AuditLog::create([
                    'TableName' => 'teacherprofile',
                    'RecordID' => $teacherProfile->TeacherProfileID,
                    'Operation' => 'UPDATE',
                    'UserID' => User::getCurrentUserId(), 
                    'OldValues' => $oldValues,
                    'NewValues' => json_encode(new TeacherProfileResource($teacherProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'teacherProfile');
            });

            return response()->json([
                'message' => 'Teacher updated successfully',
                'data' => new TeacherProfileResource($updatedData['teacherProfile']->fresh('profile.user'))
            ], 200);

        } catch (\Throwable $e) {

            Log::error('Teacher update failed', ['error' => $e->getMessage()]);

            // Clean up the newly uploaded file
            if ($request->hasFile('ProfilePicture') && isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Teacher record update failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeacherProfile $teacherProfile)
    {
        //
    }

    public function archive(Request $request, TeacherProfile $teacherProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $teacherProfile->profile->user->update([
            'IsDeleted' => true,
            'AccountStatus' => $validated['AccountStatus']
        ]);
                        
        //Generate Log
        AuditLog::create([
            'TableName' => 'teacherprofile',
            'RecordID' => $teacherProfile->TeacherProfileID,
            'Operation' => 'DELETE',
            'UserID' => User::getCurrentUserId(), 
            'OldValues' => null,
            'NewValues' => null,
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Teacher archived successfully.',
        ], 200);
    }

    public function unarchive(TeacherProfile $teacherProfile)
    {
        $teacherProfile->profile->user->update([
            'IsDeleted' => false,
            'AccountStatus' => 'Active'
        ]);

        return response()->json([
            'message' => 'Teacher unarchived successfully.',
        ], 200);
    }
}
