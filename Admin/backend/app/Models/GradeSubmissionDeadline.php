<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeSubmissionDeadline extends Model
{
    protected $table = 'GradeSubmissionDeadline';
    protected $primaryKey = 'DeadlineID';
    public $timestamps = false;

    protected $fillable = [
        'SchoolYearID',
        'Quarter',
        'StartDate',
        'DeadlineDate',
        'CreatedByUserID',
    ];
}
