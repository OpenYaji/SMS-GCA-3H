<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Helpers\AuthHelper;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // /**
    //  * The attributes that are mass assignable.
    //  *
    //  * @var list<string>
    //  */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var list<string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // /**
    //  * Get the attributes that should be cast.
    //  *
    //  * @return array<string, string>
    //  */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }



    // all codes above are defaults for user by laravel
    // added:
    protected $table = 'User';
    protected $primaryKey = 'UserID';
    public const CREATED_AT = 'CreatedAt';
    public const UPDATED_AT = 'UpdatedAt';

    protected $fillable = [
        'EmailAddress',
        'UserType',
        'AccountStatus',
        'LastLoginDate',
        'IsDeleted',
        'DeletedAt',
    ];

    /**
     * Get current authenticated user ID directly from token
     */
    public static function getCurrentUserId(): ?int
    {
        //return AuthHelper::getUserIdFromToken();
        return 1;
    }

    

    //Relationship: User has one Profile
    public function profile()
    {
        return $this->hasOne(Profile::class, 'UserID', 'UserID');
    }

    //Relationship: User has one PasswordPolicy
    public function passwordPolicy()
    {
        return $this->hasOne(PasswordPolicy::class, 'UserID', 'UserID');
    }
}
