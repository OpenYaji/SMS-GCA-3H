<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'Attendance';
    protected $primaryKey = 'AttendanceID';
    public $timestamps = false;

    // protected $fillable = [
    //     'StudentProfileID',
    //     'ClassScheduleID',
    //     'AttendanceDate',
    //     'CheckInTime',
    //     'CheckOutTime',
    //     'AttendanceStatus',
    //     'AttendanceMethodID',
    //     'Notes'
    // ];

    //Attendance belongs to StudentProfile
    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }

    //Attendance belongs to ClassSchedule
    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'ClassScheduleID', 'ScheduleID');
    }

    //Attendance belongs to AttendanceMethod
    public function attendanceMethod()
    {
        return $this->belongsTo(AttendanceMethod::class, 'AttendanceMethodID', 'MethodID');
    }

}
