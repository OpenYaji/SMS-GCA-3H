<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use PharIo\Manifest\Author;
use Illuminate\Http\Request;
use App\Models\AuthorizedEscort;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\Auth;
use App\Http\Resources\AuthorizedEscortResource;

class AuthorizedEscortController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AuthorizedEscortResource::collection(AuthorizedEscort::with('studentProfile.profile.user')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function approve(AuthorizedEscort $authorizedEscort)
    {
        $authorizedEscort->update([
            'EscortStatus' => 'Approved',
            'IsActive' => true,
            'ApprovedByUserID' => User::getCurrentUserId(),
        ]);

        return json_encode([
            'message' => 'Authorized Escort approved successfully.'
        ], 200);
    }

    public function reject(AuthorizedEscort $authorizedEscort)
    {
        $authorizedEscort->update([
            'EscortStatus' => 'Rejected',
            'IsActive' => false,
            'ApprovedByUserID' => null,
        ]);

        return json_encode([
            'message' => 'Authorized Escort rejected successfully.'
        ], 200);
    }
}   
