<?php

use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\TeacherScheduleController;
use App\Http\Controllers\Api\V1\CurrentUserController;
use App\Http\Controllers\Api\V1\SectionController;
use App\Http\Controllers\Api\V1\SchoolYearController;
use App\Http\Controllers\Api\V1\AdminProfileController;
use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\GuardProfileController;
use App\Http\Controllers\Api\V1\StudentProfileController;
use App\Http\Controllers\Api\V1\TeacherProfileController;
use App\Http\Controllers\Api\V1\RegistrarProfileController;
use App\Http\Controllers\Api\V1\TransactionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    //Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    //Announcements
    Route::get('announcements/archived', [AnnouncementController::class, 'archived']);
    Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('announcements/{announcement}/archive', [AnnouncementController::class, 'archive']);
    Route::patch('announcements/{announcement}/unarchive', [AnnouncementController::class, 'unarchive']);
    Route::patch('announcements/{announcement}/pin', [AnnouncementController::class, 'pin']);
    Route::patch('announcements/{announcement}/unpin', [AnnouncementController::class, 'unpin']);

    // Profile
    Route::get('profile', [CurrentUserController::class, 'show']);
    Route::put('profile', [CurrentUserController::class, 'update']);
    Route::get('profile/activity-logs', [CurrentUserController::class, 'logs']);


    //Students
    Route::apiResource('student-profiles', StudentProfileController::class)->only(['index', 'show', 'update']);
    Route::post('student-profiles/{student_profile}/activate-account', [StudentProfileController::class, 'activateAccount']);
    Route::post('student-profiles/bulk-activate-accounts', [StudentProfileController::class, 'bulkActivateAccounts']);
    Route::post('student-profiles/bulk-archive-accounts', [StudentProfileController::class, 'bulkArchiveAccounts']);
    Route::patch('student-profiles/{student_profile}/archive', [StudentProfileController::class, 'archive']);
    Route::patch('student-profiles/{student_profile}/unarchive', [StudentProfileController::class, 'unarchive']);
    Route::patch('student-profiles/{student_profile}/archive-account', [StudentProfileController::class, 'archiveAccount']);
    Route::patch('student-profiles/{student_profile}/unarchive-account', [StudentProfileController::class, 'unarchiveAccount']);
    Route::patch('student-profiles/{student_profile}/archive-record', [StudentProfileController::class, 'archiveRecord']);
    Route::patch('student-profiles/{student_profile}/unarchive-record', [StudentProfileController::class, 'unarchiveRecord']);
    Route::patch('student-profiles/{student_profile}/change-section', [StudentProfileController::class, 'changeSection']);
    Route::get('student-profiles/{student_profile}/grades', [StudentProfileController::class, 'grades'])->name('student.grades');
    Route::get('student-profiles/{student_profile}/attendance', [StudentProfileController::class, 'attendance'])->name('student.attendance');

    //Teachers
    Route::apiResource('teacher-profiles', TeacherProfileController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('teacher-profiles/{teacher_profile}/archive', [TeacherProfileController::class, 'archive']);
    Route::patch('teacher-profiles/{teacher_profile}/unarchive', [TeacherProfileController::class, 'unarchive']);

    //Guards
    Route::apiResource('guard-profiles', GuardProfileController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('guard-profiles/{guard_profile}/archive', [GuardProfileController::class, 'archive']);
    Route::patch('guard-profiles/{guard_profile}/unarchive', [GuardProfileController::class, 'unarchive']);
    
    //Registrars
    Route::apiResource('registrar-profiles', RegistrarProfileController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('registrar-profiles/{registrar_profile}/archive', [RegistrarProfileController::class, 'archive']);
    Route::patch('registrar-profiles/{registrar_profile}/unarchive', [RegistrarProfileController::class, 'unarchive']);

    //Admins
    Route::apiResource('admin-profiles', AdminProfileController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('admin-profiles/{admin_profile}/archive', [AdminProfileController::class, 'archive']);
    Route::patch('admin-profiles/{admin_profile}/unarchive', [AdminProfileController::class, 'unarchive']);

    //School Years
    Route::apiResource('school-years', SchoolYearController::class)->only(['index', 'show', 'store', 'update']);

    //Sections
    Route::apiResource('sections', SectionController::class)->only(['store', 'update']);
    Route::get('sections/{section}/students', [SectionController::class, 'students'])->name('sections.students');
    Route::get('sections/{section}/schedule', [SectionController::class, 'schedule'])->name('sections.schedule');
    Route::get('sections/{section}/attendance', [SectionController::class, 'attendance'])->name('sections.attendance');

    // Teacher Schedules
    Route::get('schedule-confirmations', [TeacherScheduleController::class, 'index']);
    Route::get('schedule-confirmations/{teacherId}', [TeacherScheduleController::class, 'show']);
    Route::put('schedule-confirmations/approve-all', [TeacherScheduleController::class, 'approveAll']);
    Route::put('schedule-confirmations/decline-all', [TeacherScheduleController::class, 'declineAll']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']); // list all
    Route::get('/transactions/{id}', [TransactionController::class, 'show']); // show one
});