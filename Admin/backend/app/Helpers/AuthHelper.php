<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthHelper
{
    /**
     * Extract user ID directly from JWT token
     */
    public static function getUserIdFromToken(): ?int
    {
        try {
            $token = self::getTokenFromRequest();
            
            if (!$token) {
                return null;
            }

            // Extract user ID directly from token session
            $userSession = DB::table('user_sessions as us')
                ->join('user as u', 'us.UserID', '=', 'u.UserID')
                ->select('u.UserID')
                ->where('us.Token', $token)
                ->where('us.ExpiresAt', '>', now())
                ->where('u.AccountStatus', 'Active')
                ->first();

            return $userSession ? (int) $userSession->UserID : null;

        } catch (\Exception $e) {
            Log::error("Token user ID extraction error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Extract token from request (same logic as middleware)
     */
    private static function getTokenFromRequest(): ?string
    {
        $request = request();
        
        // Check Authorization header (Bearer token)
        if ($request->header('Authorization')) {
            if (preg_match('/Bearer\s+(.*)$/i', $request->header('Authorization'), $matches)) {
                return $matches[1];
            }
        }

        // Check query parameter
        if ($request->query('token')) {
            return $request->query('token');
        }

        // Check cookie
        if ($request->cookie('auth_token')) {
            return $request->cookie('auth_token');
        }

        return null;
    }

    /**
     * Get current authenticated user data from token
     */
    public static function getCurrentUserData(): ?array
    {
        try {
            $token = self::getTokenFromRequest();
            
            if (!$token) {
                return null;
            }

            $userSession = DB::table('user_sessions as us')
                ->join('user as u', 'us.UserID', '=', 'u.UserID')
                ->join('profile as p', 'u.UserID', '=', 'p.UserID')
                ->select(
                    'u.UserID',
                    'u.UserType',
                    'u.AccountStatus',
                    DB::raw("CONCAT(p.FirstName, ' ', p.LastName) AS FullName")
                )
                ->where('us.Token', $token)
                ->where('us.ExpiresAt', '>', now())
                ->where('u.AccountStatus', 'Active')
                ->first();

            return $userSession ? [
                'userId' => (int) $userSession->UserID,
                'fullName' => $userSession->FullName,
                'userType' => $userSession->UserType,
                'accountStatus' => $userSession->AccountStatus
            ] : null;

        } catch (\Exception $e) {
            Log::error("Token user data extraction error: " . $e->getMessage());
            return null;
        }
    }
}