<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RegistrarProfile extends Model
{
    /** @use HasFactory<\Database\Factories\GuardProfileFactory> */
    use HasFactory;
    
    protected $table = 'RegistrarProfile';
    protected $primaryKey = 'RegistrarProfileID';
    public $timestamps = false;

    protected $fillable = [
        'ProfileID',
        'EmployeeNumber',
        'HireDate'
    ];

    //Relationship: RegistrarProfile belongs to a Profile
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'ProfileID', 'ProfileID');
    }
}
