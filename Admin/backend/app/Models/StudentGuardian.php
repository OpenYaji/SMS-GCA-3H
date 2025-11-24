<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StudentGuardian extends Pivot
{
    protected $table = 'StudentGuardian';
    protected $primaryKey = 'StudentGuardianID';
    public $timestamps = false;

    protected $fillable = [
        'StudentProfileID',
        'GuardianID',
        'RelationshipType',
        'IsPrimaryContact',
        'IsEmergencyContact',
        'IsAuthorizedPickup',
        'SortOrder'
    ];

}
