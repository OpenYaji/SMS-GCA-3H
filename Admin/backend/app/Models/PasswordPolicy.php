<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordPolicy extends Model
{
    protected $table = 'PasswordPolicy';
    protected $primaryKey = 'PolicyID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'PasswordHash',
        'PasswordSetDate'
    ];

    //Relationship: PasswordPolicy belongs to a user
    public function user()
    {
        $this->belongsTo(User::class, 'UserID', 'UserID');
    }
    
}
