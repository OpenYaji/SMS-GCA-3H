<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuardProfile extends Model
{
    /** @use HasFactory<\Database\Factories\GuardProfileFactory> */
    use HasFactory;

    protected $table = 'GuardProfile';
    protected $primaryKey = 'GuardProfileID';
    public $timestamps = false;

    protected $fillable = [
        'ProfileID',
        'EmployeeNumber',
        'HireDate'
    ];

    //Relationship: GuardProfile belongs to a Profile
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'ProfileID', 'ProfileID');
    }
}
