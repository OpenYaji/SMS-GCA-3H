<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class EncryptionHelper
{
    
    public static function decrypt(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        try {
            return Crypt::decryptString($value);
            // return $value;
        } catch (DecryptException $e) {
            return null;
        }
    }

    public static function encrypt(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        return Crypt::encryptString($value);
        // return $value;
    }
    
}
