<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Profile;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use Illuminate\Http\Request;
use App\Models\PasswordPolicy;
use App\Models\RegistrarProfile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\RegistrarProfileResource;
use App\Http\Requests\StoreRegistrarProfileRequest;
use App\Http\Requests\UpdateRegistrarProfileRequest;

class RegistrarProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RegistrarProfileResource::collection(RegistrarProfile::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegistrarProfileRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('ProfilePicture')) {
            // Store profile in storage/app/public/profiles
            $path = $request->file('ProfilePicture')->store('profiles', 'public');
            $validated['ProfilePictureURL'] = asset('storage/' . $path); // include the public URL
        }

        $plainPassword = Str::random(10);

        try {
            $registrarData = DB::transaction(function () use ($validated, $request, $plainPassword) {
                // Create user
                $user = User::create([
                    'EmailAddress' => $validated['EmailAddress'],
                    'UserType' => 'Registrar',
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

                // Create registrar profile
                $registrarProfile = RegistrarProfile::create([
                    'ProfileID' => $profile->ProfileID,
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);

                // Generate registrar employee number
                $registrarProfile->EmployeeNumber = 'R-' . str_pad($registrarProfile->RegistrarProfileID, 5, '0', STR_PAD_LEFT);
                $registrarProfile->save();

                //Generate Log
                AuditLog::create([
                    'TableName' => 'registrarprofile',
                    'RecordID' => $registrarProfile->RegistrarProfileID,
                    'Operation' => 'INSERT',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => null,
                    'NewValues' => json_encode(new RegistrarProfileResource($registrarProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'registrarProfile');
            });

            // Send to created user
            Mail::to($registrarData['user']->EmailAddress)->send(new AccountCreated($registrarData['user'], $plainPassword));

            return response()->json([
                'message' => 'Registrar created successfully',
                'data' => new RegistrarProfileResource($registrarData['registrarProfile'])
            ], 201);

        } catch (\Throwable $e) {
            
            Log::error('Registrar creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Registrar account creation failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RegistrarProfile $registrarProfile)
    {
        return RegistrarProfileResource::make($registrarProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegistrarProfileRequest $request, RegistrarProfile $registrarProfile)
    {
        // Old values before update
        $oldValues = json_encode(new RegistrarProfileResource($registrarProfile));

        $validated = $request->validated();

        // Get profile and corresponding user
        $profile = $registrarProfile->profile;
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
            $updatedData = DB::transaction(function () use ($validated, $request, $oldValues, $profile, $user, $registrarProfile, $profilePictureURL) {

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

                // Update registrar profile
                $registrarProfile->update([
                    'HireDate' => $validated['HireDate'] ?? null,
                ]);
                
                //Generate Log
                AuditLog::create([
                    'TableName' => 'registrarprofile',
                    'RecordID' => $registrarProfile->RegistrarProfileID,
                    'Operation' => 'UPDATE',
                    'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
                    'OldValues' => $oldValues,
                    'NewValues' => json_encode(new RegistrarProfileResource($registrarProfile)),
                    'IPAddress' => $request->ip(),
                    'UserAgent' => $request->userAgent(),
                    'Timestamp' => now(),
                ]);

                return compact('user', 'registrarProfile');
            });

            return response()->json([
                'message' => 'Registrar updated successfully',
                'data' => new RegistrarProfileResource($updatedData['registrarProfile']->fresh('profile.user'))
            ], 200);

        } catch (\Throwable $e) {

            Log::error('Registrar update failed', ['error' => $e->getMessage()]);

            // Clean up the newly uploaded file
            if ($request->hasFile('ProfilePicture') && isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Registrar record update failed',
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RegistrarProfile $registrarProfile)
    {
        //
    }

    public function archive(Request $request, RegistrarProfile $registrarProfile)
    {
        $validated = $request->validate([
            'AccountStatus' => 'required|in:Inactive,Suspended'
        ]);

        $registrarProfile->profile->user->update([
            'IsDeleted' => true,
            'AccountStatus' => $validated['AccountStatus']
        ]);
                        
        //Generate Log
        AuditLog::create([
            'TableName' => 'registrarprofile',
            'RecordID' => $registrarProfile->RegistrarProfileID,
            'Operation' => 'DELETE',
            'UserID' => User::SYSTEM_USER_ID, //hardcoded user for now
            'OldValues' => null,
            'NewValues' => null,
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Registrar archived successfully.',
        ], 200);
    }

    public function unarchive(RegistrarProfile $registrarProfile)
    {
        $registrarProfile->profile->user->update([
            'IsDeleted' => false,
            'AccountStatus' => 'Active'
        ]);

        return response()->json([
            'message' => 'Registrar unarchived successfully.',
        ], 200);
    }
}
