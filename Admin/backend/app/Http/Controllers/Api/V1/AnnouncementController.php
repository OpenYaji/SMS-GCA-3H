<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\Announcement;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\AnnouncementResource;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AnnouncementResource::collection(Announcement::where('IsActive', true)->get());
    }

    public function archived()
    {
        return AnnouncementResource::collection(Announcement::where('IsActive', false)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnnouncementRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('Banner')) {
            // Store banner in storage/app/public/announcements
            $path = $request->file('Banner')->store('announcements', 'public');
            $data['BannerURL'] = asset('storage/' . $path); // include the public URL
        }

        // Create the announcement
        $announcement = Announcement::create(array_merge(
            $data,
            ['AuthorUserID' => User::getCurrentUserId()] 
        ));
             
        //Generate Log
        AuditLog::create([
            'TableName' => 'announcement',
            'RecordID' => $announcement->AnnouncementID,
            'Operation' => 'INSERT',
            'UserID' => User::getCurrentUserId(), 
            'OldValues' => null,
            'NewValues' => json_encode($announcement->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Announcement created successfully.',
            'data' => new AnnouncementResource($announcement),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement)
    {
        return AnnouncementResource::make($announcement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        // Old values before update
        $oldValues = json_encode($announcement->toArray());

        $data = $request->validated();

        if ($request->hasFile('Banner')) {
            // Delete the old banner if it exists
            if ($announcement->BannerURL) {
                $oldPath = str_replace(asset('storage/'), '', $announcement->BannerURL);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('Banner')->store('announcements', 'public');
            $data['BannerURL'] = asset('storage/' . $path);
        }

        $announcement->update($data);
             
        //Generate Log
        AuditLog::create([
            'TableName' => 'announcement',
            'RecordID' => $announcement->AnnouncementID,
            'Operation' => 'UPDATE',
            'UserID' => User::getCurrentUserId(), 
            'OldValues' => $oldValues,
            'NewValues' => json_encode($announcement->fresh()->toArray()),
            'IPAddress' => $request->ip(),
            'UserAgent' => $request->userAgent(),
            'Timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Announcement updated successfully.',
            'data' => new AnnouncementResource($announcement),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        //
    }


    public function pin(Announcement $announcement)
    {
        $announcement->update(['IsPinned' => true]);

        return response()->json([
            'message' => 'Announcement pinned successfully.',
        ], 200);
    }

    public function unpin(Announcement $announcement)
    {
        $announcement->update(['IsPinned' => false]);

        return response()->json([
            'message' => 'Announcement unpinned successfully.',
        ], 200);
    }

    public function archive(Announcement $announcement)
    {
        $announcement->update(['IsActive' => false]);

        return response()->json([
            'message' => 'Announcement archived successfully.',
        ], 200);
    }

    public function unarchive(Announcement $announcement)
    {
        $announcement->update(['IsActive' => true]);

        return response()->json([
            'message' => 'Announcement unarchived successfully.',
        ], 200);
    }
}
