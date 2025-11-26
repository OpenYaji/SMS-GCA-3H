<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{

    protected $table = 'ClassSchedule';
    protected $primaryKey = 'ScheduleID';
    public $timestamps = false;

    // protected $fillable = [
	//     'SectionID',
    // 	'SubjectID',
    // 	'TeacherProfileID',
    // 	'DayOfWeek',
    // 	'StartTime',
    // 	'EndTime',
    // 	'ScheduleStatusID',
    // 	'RoomNumber',
    // ];


    //Relationship: ClassSchedule belongs to a Subject
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'SubjectID', 'SubjectID');
    }

    //Relationship: ClassSchedule belongs to a TeacherProfile
    public function teacherProfile()
    {
        return $this->belongsTo(TeacherProfile::class, 'TeacherProfileID', 'TeacherProfileID');
    }

    //Relationship: ClassSchedule belongs to a ScheduleStatus
    public function status()
    {
        return $this->belongsTo(ScheduleStatus::class, 'ScheduleStatusID', 'StatusID');
    }

    // Added relationship for TeacherScheduleController
    public function section()
    {
        return $this->belongsTo(Section::class, 'SectionID');
    }

}
