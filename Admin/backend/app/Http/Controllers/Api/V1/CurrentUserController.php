<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCurrentUserRequest;
use App\Http\Resources\AdminProfileResource;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\CurrentUserResource;
use App\Models\AdminProfile;
use App\Models\AuditLog;
use App\Helpers\EncryptionHelper;
use Illuminate\Support\Facades\Storage;

class CurrentUserController extends Controller
{
    /**
     * Display the authenticated user's profile
     */
    public function show()  
    {
        // TODO: Replace with actual authenticated user
        // $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', auth()->id())->first();

        // For now, hardcoded to user ID 8 for testing
       $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', 8)->first();

        if (!$adminprofile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return CurrentUserResource::make($adminprofile);
    }

    /**
     * Update the authenticated user's profile
     * FIXED: Now handles profile picture uploads and uses EncryptionHelper
     */
    public function update(UpdateCurrentUserRequest $request)
    {
        // TODO: Replace with actual authenticated user later
        // $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', auth()->id())->first();

       $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', 8)->first();

        if (!$adminprofile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // Update Profile fields
        if ($adminprofile->profile) {
            // Prepare data for update
            $profileData = [];

            // Basic name fields
            if ($request->has('FirstName')) {
                $profileData['FirstName'] = $request->FirstName;
            }
            if ($request->has('LastName')) {
                $profileData['LastName'] = $request->LastName;
            }
            if ($request->has('MiddleName')) {
                $profileData['MiddleName'] = $request->MiddleName;
            }

            // EncryptionHelper for consistent encryption
            if ($request->has('PhoneNumber')) {
                $phoneNumber = $request->PhoneNumber;
                $profileData['EncryptedPhoneNumber'] = EncryptionHelper::encrypt($phoneNumber);
            }

            if ($request->has('Address')) {
                $address = $request->Address;
                $profileData['EncryptedAddress'] = EncryptionHelper::encrypt($address);
            }

            // Additional profile fields
            if ($request->has('Gender')) {
                $profileData['Gender'] = $request->Gender;
            }
            if ($request->has('BirthDate')) {
                $profileData['BirthDate'] = $request->BirthDate;
            }
            if ($request->has('Age')) {
                $profileData['Age'] = $request->Age;
            }

            // Handle profile picture upload
            if ($request->hasFile('ProfilePicture')) {
                // Delete old picture if exists
                if ($adminprofile->profile->ProfilePictureURL) {
                    $oldPath = str_replace(asset('storage/'), '', $adminprofile->profile->ProfilePictureURL);
                    Storage::disk('public')->delete($oldPath);
                }
                
                // Store new picture
                $path = $request->file('ProfilePicture')->store('profiles', 'public');
                $profileData['ProfilePictureURL'] = asset('storage/' . $path);
            } elseif ($request->has('ProfilePictureURL')) {
                $profileData['ProfilePictureURL'] = $request->ProfilePictureURL;
            }

            $adminprofile->profile->update($profileData);
        }

        // Update User email if provided
        if ($adminprofile->profile && $adminprofile->profile->user && $request->has('EmailAddress')) {
            $adminprofile->profile->user->update([
                'EmailAddress' => $request->EmailAddress,
            ]);
        }

        return new CurrentUserResource($adminprofile->fresh(['profile.user']));
    }

    public function logs(){
        $logs = AuditLog::with('profile')->get();
        return AuditLogResource::collection($logs);
    }
}