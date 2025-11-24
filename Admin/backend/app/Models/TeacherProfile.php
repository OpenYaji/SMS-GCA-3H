<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    /** @use HasFactory<\Database\Factories\TeacherProfileFactory> */
    use HasFactory;

    protected $table = 'TeacherProfile';
    protected $primaryKey = 'TeacherProfileID';
    public $timestamps = false;

    protected $fillable = [
        'ProfileID',
        'EmployeeNumber',
        'Specialization',
        'HireDate'
    ];

    //Relationship: TeacherProfile belongs to a Profile
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'ProfileID', 'ProfileID');
    }

    // Added relationship for TeacherScheduleController
    public function schedule(){
        return $this->belongsTo(ClassSchedule::class, 'TeacherProfileID', 'TeacherProfileID');
    }
}
