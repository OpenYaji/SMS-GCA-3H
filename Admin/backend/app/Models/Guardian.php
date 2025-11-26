<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $table = 'Guardian';
    protected $primaryKey = 'GuardianID';
    public $timestamps = false;

    protected $hidden = [
        'EncryptedPhoneNumber',
        'EncryptedEmailAddress'
    ];

    protected $fillable = [
        'FullName',
        'EncryptedPhoneNumber',
        'EncryptedEmailAddress',
        'Occupation',
        'WorkAddress'
    ];
}
