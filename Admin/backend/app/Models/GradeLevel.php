<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeLevel extends Model
{
    protected $table = 'GradeLevel';
    protected $primaryKey = 'GradeLevelID';
    public $timestamps = false;

    //Relationship: GradeLevel has many section
    public function sections()
    {
        return $this->hasMany(Section::class, 'GradeLevelID', 'GradeLevelID');
    }
}
