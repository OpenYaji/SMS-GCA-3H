<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleStatus extends Model
{

    protected $table = 'ScheduleStatus';
    protected $primaryKey = 'StatusID';
    public $timestamps = false;

    const APPROVED = 1;
    const PENDING = 2;
    const REJECTED = 3;

    //Relationship: ScheduleStatus has many class schedules
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'ScheduleStatusID', 'StatusID');
    }

}
