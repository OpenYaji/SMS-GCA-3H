<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthorizedEscort extends Model
{

    protected $table = 'authorized_escort';
    protected $primaryKey = 'EscortID';
    public $timestamps = false;

    protected $fillable = [
        'StudentProfileID',
        'FullName',
        'RelationshipToStudent',
        'ContactNumber',
        'Address',
        'AdditionalNotes',
        'EscortStatus',
        'IsActive',
        'DateAdded',
        'ApprovedByUserID'
    ];
    
    //Relationship: AuthorizedEscort belongs to a StudentProfile
    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }
}
