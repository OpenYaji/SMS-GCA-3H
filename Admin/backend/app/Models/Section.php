<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    /** @use HasFactory<\Database\Factories\SectionFactory> */
    use HasFactory;

    protected $primaryKey = 'SectionID';
    protected $table = 'Section';
    public $timestamps = false;

    protected $fillable = [
        'GradeLevelID',
        'SchoolYearID',
        'AdviserTeacherID',
        'SectionName',
        'MaxCapacity',
        'CurrentEnrollment',
    ];

    //Relationship: Section belongs to a GradeLevel
    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class, 'GradeLevelID', 'GradeLevelID');
    }

    //Relationship: Section belongs to a SchoolYear
    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearID', 'SchoolYearID');
    }

    //Relationship: Section belongs to an adviser(TeacherProfile)
    public function adviserTeacher()
    {
        return $this->belongsTo(TeacherProfile::class, 'AdviserTeacherID', 'TeacherProfileID');
    }
    
    //Relationship: Section has many enrollment
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'SectionID', 'SectionID');
    }

    //Relationship: Section has many class schedules
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'SectionID', 'SectionID');
    }

    //Get all attendances for students in this section
    public function attendances()
    {
        return $this->hasManyThrough(
            Attendance::class,
            Enrollment::class,
            'SectionID', // Foreign key on Enrollment table
            'StudentProfileID', // Foreign key on Attendance table
            'SectionID', // Local key on Section table
            'StudentProfileID' // Local key on Enrollment table
        );
    }
    
}
