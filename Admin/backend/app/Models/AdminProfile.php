<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminProfile extends Model
{
    /** @use HasFactory<\Database\Factories\AdminProfileFactory> */
    use HasFactory;

    protected $table = 'AdminProfile';
    protected $primaryKey = 'AdminProfileID';
    public $timestamps = false;

    protected $fillable = [
        'ProfileID',
        'EmployeeNumber',
        'HireDate'
    ];

    //Relationship: AdminProfile belongs to a Profile
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'ProfileID', 'ProfileID');
    }
}
