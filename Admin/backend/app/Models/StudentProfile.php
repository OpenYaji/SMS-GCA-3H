<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    /** @use HasFactory<\Database\Factories\StudentProfileFactory> */
    use HasFactory;

    protected $table = 'StudentProfile';
    protected $primaryKey = 'StudentProfileID';
    public $timestamps = false;

    protected $fillable = [
        'ProfileID',
        'StudentNumber',
        'QRCodeID',
        'DateOfBirth',
        'Gender',
        'Nationality',
        'StudentStatus',
        'ArchiveDate',
    ];

    //Relationship: StudentProfile belongs to a Profile
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'ProfileID', 'ProfileID');
    }

    //Relationship: StudentProfile has one MedicalInfo
    public function medicalInfo()
    {
        return $this->hasOne(MedicalInfo::class, 'StudentProfileID', 'StudentProfileID');
    }

    //Relationship: StudentProfile has one EmergencyContact
    // will change to hasMany later if ever students can have more
    public function emergencyContact()
    {
        return $this->hasOne(EmergencyContact::class, 'StudentProfileID', 'StudentProfileID');
    }

    /*
    * Relationship: StudentProfile belongs to and can have many guardians 
    * through StudentGuardian pivot (with other fields)
    */
    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'StudentGuardian', 'StudentProfileID', 'GuardianID')
                    ->using(StudentGuardian::class)
                    ->withPivot([
                        'RelationshipType',
                        'IsPrimaryContact',
                        'IsEmergencyContact',
                        'IsAuthorizedPickup',
                        'SortOrder'
                    ]);
    }

    //Relationship: StudentProfile has many Enrollment
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'StudentProfileID', 'StudentProfileID');
    }

    // public function latestEnrollment()
    // {
    //     return $this->hasOne(Enrollment::class, 'StudentProfileID', 'StudentProfileID')
    //                 ->latest('EnrollmentID');
    // }

    //Relationship: StudentProfile has many Attendance
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'StudentProfileID', 'StudentProfileID');
    }
}
