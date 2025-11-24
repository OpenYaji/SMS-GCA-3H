<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalInfo extends Model
{
    /** @use HasFactory<\Database\Factories\MedicalInfoFactory> */
    use HasFactory;

    protected $table = 'MedicalInfo';
    protected $primaryKey = 'MedicalInfoID';
    public $timestamps = false;

    protected $hidden = [
        'EncryptedAllergies',
        'EncryptedMedicalConditions',
        'EncryptedMedications', 
    ];

    protected $fillable = [
        'Height',
        'Weight',
        'EncryptedAllergies',
        'EncryptedMedicalConditions',
        'EncryptedMedications'
    ];

    //Relationship: MedicalInfo belongs to a StudentProfile
    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }
}
