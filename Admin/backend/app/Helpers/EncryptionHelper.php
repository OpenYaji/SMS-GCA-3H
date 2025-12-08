<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class EncryptionHelper
{
    /**
     * Encrypt a value using Laravel's Crypt facade
     * 
     * @param mixed $value
     * @return string|null
     */
    public static function encrypt($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return Crypt::encryptString((string) $value);
        } catch (\Exception $e) {
            \Log::error('Encryption failed', [
                'error' => $e->getMessage(),
                'value_length' => strlen($value)
            ]);
            return null;
        }
    }

    /**
     * Decrypt a value using Laravel's Crypt facade
     * Returns null if decryption fails
     * 
     * @param mixed $encryptedValue
     * @return string|null
     */
    public static function decrypt($encryptedValue)
    {
        if ($encryptedValue === null || $encryptedValue === '') {
            return null;
        }

        try {
            return Crypt::decryptString($encryptedValue);
        } catch (DecryptException $e) {
            \Log::warning('Decryption failed', [
                'error' => $e->getMessage(),
                'encrypted_length' => is_string($encryptedValue) ? strlen($encryptedValue) : 'not_string'
            ]);
            return null;
        } catch (\Exception $e) {
            \Log::error('Unexpected decryption error', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Check if a value appears to be encrypted
     * 
     * @param mixed $value
     * @return bool
     */
    public static function isEncrypted($value)
    {
        if (!is_string($value) || empty($value)) {
            return false;
        }

        // Laravel's encrypted strings are typically base64 encoded JSON
        try {
            $decoded = base64_decode($value, true);
            if ($decoded === false) {
                return false;
            }
            
            $json = json_decode($decoded, true);
            return is_array($json) && isset($json['iv']) && isset($json['value']);
        } catch (\Exception $e) {
            return false;
        }
    }
}   