<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{

    protected $table = 'AuditLog';
    protected $primaryKey = 'AuditID';
    public $timestamps = false;
    
    protected $fillable = [
	    'TableName',
    	'RecordID',
    	'Operation',
    	'UserID',
    	'OldValues',
    	'NewValues',
    	'IPAddress',
    	'UserAgent',
    	'Timestamp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'UserID', 'UserID');
    }
}
