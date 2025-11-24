<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{

    protected $table = 'Subject';
    protected $primaryKey = 'SubjectID';
    public $timestamps = false;

    // protected $fillable = [
    //     'SubjectName',
    //     'SubjectCode',
    //     'GradeLevelID',
    //     'IsActive',
    // ];


    //Relationship: Subject belongs to a GradeLevel
    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class, 'GradeLevelID', 'GradeLevelID');
    }

}
