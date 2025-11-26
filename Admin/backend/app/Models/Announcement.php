<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    /** @use HasFactory<\Database\Factories\AnnouncementFactory> */
    use HasFactory;

    protected $table = 'Announcement';
    protected $primaryKey = 'AnnouncementID';
    
    protected $fillable = [
        'AuthorUserID',
        'Title',
        'Content',
        'Summary',
        'Category',
        'BannerURL',
        'PublishDate',
        'ExpiryDate',
        'TargetAudience',
        'IsPinned',
        'IsActive',
    ];

    public $timestamps = false;
}
