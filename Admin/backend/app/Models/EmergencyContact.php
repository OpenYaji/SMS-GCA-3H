<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    /** @use HasFactory<\Database\Factories\EmergencyContactFactory> */
    use HasFactory;

    protected $table = 'EmergencyContact';
    protected $primaryKey = 'EmergencyContactID';
    public $timestamps = false;

    protected $hidden = [
        'EncryptedContactNumber	'
    ];

    protected $fillable = [
        'StudentProfileID',
        'ContactPerson',
        'EncryptedContactNumber'
    ];

    //Relationship: EmergencyContact belongs to a StudentProfile
    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }
}
