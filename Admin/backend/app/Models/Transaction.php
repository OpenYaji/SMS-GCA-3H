<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transaction';
    protected $primaryKey = 'TransactionID';

    public function studentProfile(){
        return $this->belongsTo(StudentProfile::class, 'StudentProfileID', 'StudentProfileID');
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class, 'TransactionID', 'TransactionID');
    }
}
