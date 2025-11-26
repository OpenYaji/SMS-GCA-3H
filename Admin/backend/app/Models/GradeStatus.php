<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeStatus extends Model
{    
    protected $table = 'GradeStatus';
    protected $primaryKey = 'StatusID';
    public $timestamps = false;

    // protected $fillable = [
    //     'StatusName',
    // ];
}
