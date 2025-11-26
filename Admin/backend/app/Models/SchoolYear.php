<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $table = 'SchoolYear';
    protected $primaryKey = 'SchoolYearID';
    public $timestamps = false;

    protected $fillable = [
        'YearName',
        'StartDate',
        'EndDate',
        'IsActive'
    ];

    //Relationship: SchoolYear has many section
    public function sections()
    {
        return $this->hasMany(Section::class, 'SchoolYearID', 'SchoolYearID');
    }

    //Get GradeLevels associated with this SchoolYear, with filtered sections
    public function gradeLevels()
    {
        return GradeLevel::with(['sections' => function ($query) {
            $query->where('SchoolYearID', $this->SchoolYearID);
        }]);
    }

    // Get the currently active school year (based on dates)
    public static function getCurrentSchoolYear()
    {
        return static::where('EndDate', '>=', now())->latest('StartDate')->first();
    }

}
