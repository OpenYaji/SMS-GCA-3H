<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCurrentUserRequest;
use App\Http\Resources\AdminProfileResource;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\CurrentUserResource;
use App\Models\AdminProfile;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Crypt;

class CurrentUserController extends Controller
{
    /**
     * Display the authenticated user's profile
     */
    public function show()
    {
        // TODO: Replace with actual authenticated user
        // $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', auth()->id())->first();

        // For now, hardcoded to user ID 1 for testing
       $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', 1)->first();

        if (!$adminprofile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return CurrentUserResource::make($adminprofile);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(UpdateCurrentUserRequest $request)
    {
        // TODO: Replace with actual authenticated user later
        // $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', auth()->id())->first();

       $adminprofile = AdminProfile::with(['profile.user'])->where('ProfileID', 1)->first();

        if (!$adminprofile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // Update Profile fields
        if ($adminprofile->profile) {
        $adminprofile->profile->update([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'MiddleName' => $request->MiddleName,
            'PhoneNumber' => $request->PhoneNumber,
            'Address' => $request->Address,
            'ProfilePictureURL' => $request->ProfilePictureURL,
        ]);
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
