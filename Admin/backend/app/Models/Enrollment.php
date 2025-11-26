<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $table = 'Enrollment';
    protected $primaryKey = 'EnrollmentID';
    public $timestamps = false;

    protected $fillable = [
        // 'StudentProfileID',
    	'SectionID',
    	// 'SchoolYearID',
    	// 'EnrollmentDate',
    ];

    //Relationship: Enrollment belongs to StudenProfile
    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }

    //Relationship: Enrollment belongs to Section
    public function section()
    {
        return $this->belongsTo(Section::class, 'SectionID', 'SectionID');
    }

    //Relationship: Enrollment has many Grade
    public function grades()
    {
        return $this->hasMany(Grade::class, 'EnrollmentID', 'EnrollmentID');
    }
}
