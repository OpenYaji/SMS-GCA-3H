<?php

namespace App\Http\Controllers\Api\V1;

use Carbon\Carbon;
use App\Models\SchoolYear;
use App\Models\Transaction;
use App\Models\AdminProfile;
use App\Models\Announcement;
use App\Models\GuardProfile;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;

use App\Models\TransactionItem;
use App\Models\RegistrarProfile;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //students
        $studentTotal = StudentProfile::where('StudentStatus', 'Enrolled')->count();
        $studentMale = StudentProfile::where('StudentStatus', 'Enrolled')->where('Gender', 'male')->count();
        $studentFemale = StudentProfile::where('StudentStatus', 'Enrolled')->where('Gender', 'female')->count();
        
        //teachers
        $teacherCount = TeacherProfile::whereHas('profile.user', function ($q) {
            $q->whereNull('DeletedAt')->where('IsDeleted', false);
        })->count();
        
        //guards
        $guardCount = GuardProfile::whereHas('profile.user', function ($q) {
            $q->whereNull('DeletedAt')->where('IsDeleted', false);
        })->count();
        
        //registrars
        $registrarCount = RegistrarProfile::whereHas('profile.user', function ($q) {
            $q->whereNull('DeletedAt')->where('IsDeleted', false);
        })->count();
        
        //admins
        $adminCount = AdminProfile::whereHas('profile.user', function ($q) {
            $q->whereNull('DeletedAt')->where('IsDeleted', false);
        })->count();

        //pinned announcements
        $pinnedAnnouncements = Announcement::where('IsPinned', true)->get();
        // Transaction Logic

        // Fee Status is per school year
        $today = Carbon::today();

        // Get current school year or fallback to latest
        $schoolYear = SchoolYear::where('StartDate', '<=', $today)
                                ->where('EndDate', '>=', $today)
                                ->first();

        if (!$schoolYear) {
            $schoolYear = SchoolYear::latest('EndDate')->first();
        }

        // Extract start and end dates
        $schoolYearStart = Carbon::parse($schoolYear->StartDate);
        $schoolYearEnd   = Carbon::parse($schoolYear->EndDate);

        // Extract start year for whereYear queries
        // $currentYear = $schoolYearStart->year;

        // Totals for Paid + Partially Paid, Pending, Overdue
        $totalPaid = Transaction::where('SchoolYearID', $schoolYear->SchoolYearID)
                        ->whereIn('TransactionStatusID', [1,2])
                        ->sum('PaidAmount');

        $totalBalance = Transaction::where('SchoolYearID', $schoolYear->SchoolYearID)
                        ->where('TransactionStatusID', 3)
                        ->where('DueDate', '>=', $today)
                        ->sum('BalanceAmount');

        $totalOverdue = Transaction::where('SchoolYearID', $schoolYear->SchoolYearID)
                        ->where('TransactionStatusID', 4)
                        ->where('DueDate', '<', $today)
                        ->sum('BalanceAmount');

        // Monthly collections starting from school year start month
        $monthlyCollections = collect();
        $current = $schoolYearStart->copy()->startOfMonth();
        $end = $schoolYearEnd->copy()->endOfMonth();

        while ($current <= $end) {
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd   = $current->copy()->endOfMonth();

            $total = Transaction::where('SchoolYearID', $schoolYear->SchoolYearID)
                        ->whereBetween('IssueDate', [$monthStart, $monthEnd])
                        ->sum('PaidAmount');

            $monthlyCollections[$current->format('F Y')] = $total;

            $current->addMonth();
        }


        return response()->json([
            'data' => [
                'Users' => [
                    'StudentCount' => [
                        'Total' => $studentTotal,
                        'Male' => $studentMale,
                        'Female' => $studentFemale
                    ],
                    'TeacherCount' => $teacherCount,
                    'RegistrarCount' => $registrarCount,
                    'AdminCount' => $adminCount,
                    'GuardCount' => $guardCount,
                ],

                'PinnedAnnouncements' => AnnouncementResource::collection($pinnedAnnouncements),
                
                'fees' => [
                    'feeStatus' => [
                        'Paid' => $totalPaid,
                        'Pending' => $totalBalance,
                        'Due' => $totalOverdue
                    ],
                    'feesCollection' => [
                        'MonthlyTotal' => $monthlyCollections
                    ]
                ]
            ]
        ]);


        
    }
}