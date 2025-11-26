<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{    
    protected $table = 'Grade';
    protected $primaryKey = 'GradeID';
    public $timestamps = false;

    // protected $fillable = [
    //     'EnrollmentID',
    //     'SubjectID',
    //     'Quarter',
    //     'GradeValue',
    //     'Remarks',
    //     'GradeStatusID',
    //     'LastModified',
    //     'ModifiedByUserID',
    // ];

    
    //Relationship: Grade belongs to Subject
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'SubjectID', 'SubjectID');
    }

    //Relationship: Grade belongs to GradeStatus
    public function gradeStatus()
    {
        return $this->belongsTo(GradeStatus::class, 'GradeStatusID', 'StatusID');
    }
}
