<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    protected $table = 'transactionitem';
    protected $primaryKey = 'ItemID';

    public function transaction(){
        return $this->belongsTo(Transaction::class, 'TransactionID', 'TransactionID');
    }
}
