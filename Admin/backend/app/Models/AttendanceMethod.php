<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceMethod extends Model
{
    protected $table = 'AttendanceMethod';
    protected $primaryKey = 'MethodID';
    public $timestamps = false;

    // protected $fillable = [
    //     'MethodName',
    //     'IsActive'
    // ];
}
