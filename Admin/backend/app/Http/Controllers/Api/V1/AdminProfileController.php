<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Profile;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use App\Models\AdminProfile;
use Illuminate\Http\Request;
use App\Models\PasswordPolicy;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\AdminProfileResource;
use App\Http\Requests\StoreAdminProfileRequest;
use App\Http\Requests\UpdateAdminProfileRequest;

class AdminProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AdminProfileResource::collection(AdminProfile::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminProfileRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('ProfilePicture')) {
            // Store profile in storage/app/public/profiles
            $path = $request->file('ProfilePicture')->store('profiles', 'public');
            $validated['ProfilePictureURL'] = asset('storage/' . $path); // include the public URL
        }

        $plainPassword = Str::random(10);

        try {
            $adminData = DB::transaction(function () use ($validated, $request, $plainPassword) {
                // Create user
                $user = User::create([
                    'EmailAddress' => $validated['EmailAddress'],
                    'UserType' => 'Admin',
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

                // Create admin profile
                $adminProfile = AdminProfile::create([
                    'ProfileID' => $profile->ProfileID,
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);

                // Generate admin employee number
                $adminProfile->EmployeeNumber = 'A-' . str_pad($adminProfile->AdminProfileID, 5, '0', STR_PAD_LEFT);
                $adminProfile->save();

                //Generate Log
                AuditLog::create([
                    'TableName' => 'adminprofile',
                    'RecordID' => $adminProfile->AdminProfileID,
                    'Operation' => 'INSERT',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => null,
                    'NewValues' => json_encode(new AdminProfileResource($adminProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'adminProfile');
            });

            // Send to created user
            Mail::to($adminData['user']->EmailAddress)->send(new AccountCreated($adminData['user'], $plainPassword));

            return response()->json([
                'message' => 'Admin created successfully',
                'data' => new AdminProfileResource($adminData['adminProfile'])
            ], 201);

        } catch (\Throwable $e) {
            
            Log::error('Admin creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Admin account creation failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AdminProfile $adminProfile)
    {
        return AdminProfileResource::make($adminProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminProfileRequest $request, AdminProfile $adminProfile)
    {
        // Old values before update
        $oldValues = json_encode(new AdminProfileResource($adminProfile));

        $validated = $request->validated();

        // Get profile and corresponding user
        $profile = $adminProfile->profile;
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
            $updatedData = DB::transaction(function () use ($validated, $request, $oldValues, $profile, $user, $adminProfile, $profilePictureURL) {

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

                // Update admin profile
                $adminProfile->update([
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);
                
                //Generate Log
                AuditLog::create([
                    'TableName' => 'adminprofile',
                    'RecordID' => $adminProfile->AdminProfileID,
                    'Operation' => 'UPDATE',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => $oldValues,
                    'NewValues' => json_encode(new AdminProfileResource($adminProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'adminProfile');
            });

            return response()->json([
                'message' => 'Admin updated successfully',
                'data' => new AdminProfileResource($updatedData['adminProfile']->fresh('profile.user'))
            ], 200);

        } catch (\Throwable $e) {

            Log::error('Admin update failed', ['error' => $e->getMessage()]);

            // Clean up the newly uploaded file
            if ($request->hasFile('ProfilePicture') && isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Admin record update failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdminProfile $adminProfile)
    {
        //
    }

    public function archive(Request $request, AdminProfile $adminProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $adminProfile->profile->user->update([
            'IsDeleted' => true,
            'AccountStatus' => $validated['AccountStatus']
        ]);
                        
        //Generate Log
        AuditLog::create([
            'TableName' => 'adminprofile',
            'RecordID' => $adminProfile->AdminProfileID,
            'Operation' => 'DELETE',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => null,
            'NewValues' => null,
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Admin archived successfully.',
        ], 200);
    }

    public function unarchive(AdminProfile $adminProfile)
    {
        $adminProfile->profile->user->update([
            'IsDeleted' => false,
            'AccountStatus' => 'Active'
        ]);

        return response()->json([
            'message' => 'Admin unarchived successfully.',
        ], 200);
    }
}
