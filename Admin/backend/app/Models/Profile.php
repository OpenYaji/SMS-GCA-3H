<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    /** @use HasFactory<\Database\Factories\ProfileFactory> */
    use HasFactory;
    
    protected $table = 'Profile';
    protected $primaryKey = 'ProfileID';
    public $timestamps = false;

    protected $hidden = [
        'EncryptedPhoneNumber',
        'EncryptedAddress',
    ];

    protected $fillable = [
        'UserID',
        'FirstName',
        'LastName',
        'MiddleName',
        'EncryptedPhoneNumber',
        'EncryptedAddress',
        'ProfilePictureURL',
    ];

    //Relationship: Profile belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    //Relationship: Profile has one StudentProfile
    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class, 'ProfileID', 'ProfileID');
    }

    //Relationship: Profile has one TeacherProfile
    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class, 'ProfileID', 'ProfileID');
    }

    //Relationship: Profile has one GuardProfile
    public function guardProfile()
    {
        return $this->hasOne(GuardProfile::class, 'ProfileID', 'ProfileID');
    }

    //Relationship: Profile has one RegistrarProfile
    public function registrarProfile()
    {
        return $this->hasOne(RegistrarProfile::class, 'ProfileID', 'ProfileID');
    }

    //Relationship: Profile has one AdminProfile
    public function adminProfile()
    {
        return $this->hasOne(AdminProfile::class, 'ProfileID', 'ProfileID');
    }
}
