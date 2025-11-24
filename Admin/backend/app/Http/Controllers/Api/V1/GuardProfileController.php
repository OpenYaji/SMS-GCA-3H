<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Profile;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use App\Models\GuardProfile;
use Illuminate\Http\Request;
use App\Models\PasswordPolicy;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\GuardProfileResource;
use App\Http\Requests\StoreGuardProfileRequest;
use App\Http\Requests\UpdateGuardProfileRequest;

class GuardProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return GuardProfileResource::collection(GuardProfile::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGuardProfileRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('ProfilePicture')) {
            // Store profile in storage/app/public/profiles
            $path = $request->file('ProfilePicture')->store('profiles', 'public');
            $validated['ProfilePictureURL'] = asset('storage/' . $path); // include the public URL
        }

        $plainPassword = Str::random(10);

        try {
            $guardData = DB::transaction(function () use ($validated, $request, $plainPassword) {
                // Create user
                $user = User::create([
                    'EmailAddress' => $validated['EmailAddress'],
                    'UserType' => 'Guard',
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
                    'EncryptedPhoneNumber' => Crypt::encryptString($validated['PhoneNumber']),
                    'EncryptedAddress' => Crypt::encryptString($validated['Address']),
                    'ProfilePictureURL' => $validated['ProfilePictureURL'] ?? null,
                ]);

                // Create guard profile
                $guardProfile = GuardProfile::create([
                    'ProfileID' => $profile->ProfileID,
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);

                // Generate guard employee number
                $guardProfile->EmployeeNumber = 'G-' . str_pad($guardProfile->GuardProfileID, 5, '0', STR_PAD_LEFT);
                $guardProfile->save();

                //Generate Log
                AuditLog::create([
                    'TableName' => 'guardprofile',
                    'RecordID' => $guardProfile->GuardProfileID,
                    'Operation' => 'INSERT',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => null,
                    'NewValues' => json_encode(new GuardProfileResource($guardProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'guardProfile');
            });

            // Send to created user
            Mail::to($guardData['user']->EmailAddress)->send(new AccountCreated($guardData['user'], $plainPassword));

            return response()->json([
                'message' => 'Guard created successfully',
                'data' => new GuardProfileResource($guardData['guardProfile'])
            ], 201);

        } catch (\Throwable $e) {
            
            Log::error('Guard creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Guard account creation failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(GuardProfile $guardProfile)
    {
        return GuardProfileResource::make($guardProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuardProfileRequest $request, GuardProfile $guardProfile)
    {
        // Old values before update
        $oldValues = json_encode(new GuardProfileResource($guardProfile));

        $validated = $request->validated();

        // Get profile and corresponding user
        $profile = $guardProfile->profile;
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
            $updatedData = DB::transaction(function () use ($validated, $request, $oldValues, $profile, $user, $guardProfile, $profilePictureURL) {

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

                // Update guard profile
                $guardProfile->update([
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);
                
                //Generate Log
                AuditLog::create([
                    'TableName' => 'guardprofile',
                    'RecordID' => $guardProfile->GuardProfileID,
                    'Operation' => 'UPDATE',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => $oldValues,
                    'NewValues' => json_encode(new GuardProfileResource($guardProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'guardProfile');
            });

            return response()->json([
                'message' => 'Guard updated successfully',
                'data' => new GuardProfileResource($updatedData['guardProfile']->fresh('profile.user'))
            ], 200);

        } catch (\Throwable $e) {

            Log::error('Guard update failed', ['error' => $e->getMessage()]);

            // Clean up the newly uploaded file
            if ($request->hasFile('ProfilePicture') && isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Guard record update failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GuardProfile $guardProfile)
    {
        //
    }

    public function archive(Request $request, GuardProfile $guardProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $guardProfile->profile->user->update([
            'IsDeleted' => true,
            'AccountStatus' => $validated['AccountStatus']
        ]);
                        
        //Generate Log
        AuditLog::create([
            'TableName' => 'guardprofile',
            'RecordID' => $guardProfile->GuardProfileID,
            'Operation' => 'DELETE',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => null,
            'NewValues' => null,
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Guard archived successfully.',
        ], 200);
    }

    public function unarchive(GuardProfile $guardProfile)
    {
        $guardProfile->profile->user->update([
            'IsDeleted' => false,
            'AccountStatus' => 'Active'
        ]);

        return response()->json([
            'message' => 'Guard unarchived successfully.',
        ], 200);
    }
}
