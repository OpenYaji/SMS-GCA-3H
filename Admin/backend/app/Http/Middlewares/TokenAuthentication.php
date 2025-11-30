<?php

namespace App\Http\Middlewares;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TokenAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get token from request (can be in header, cookie, or query parameter)
        $token = $this->getTokenFromRequest($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token required'
            ], 401);
        }

        // Verify token against database
        $userSession = $this->verifyToken($token);

        if (!$userSession) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        // Check if account is active
        if ($userSession->AccountStatus !== 'Active') {
            return response()->json([
                'success' => false,
                'message' => 'Account is inactive. Contact admin.'
            ], 403);
        }

        // Store user data in request for controller access
        $request->merge([
            'auth_user' => [
                'userId' => $userSession->UserID,
                'fullName' => $userSession->FullName,
                'userType' => $userSession->UserType,
                'accountStatus' => $userSession->AccountStatus
            ]
        ]);

        return $next($request);
    }

    /**
     * Extract token from request
     */
    private function getTokenFromRequest(Request $request): ?string
    {
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
     * Verify token against database (equivalent to verifyToken method)
     */
    private function verifyToken(string $token): ?object
    {
        try {
            $userSession = DB::table('user_sessions as us')
                ->join('user as u', 'us.UserID', '=', 'u.UserID')
                ->join('profile as p', 'u.UserID', '=', 'p.UserID')
                ->select(
                    'u.UserID',
                    'u.UserType',
                    'u.AccountStatus',
                    DB::raw("CONCAT(p.FirstName, ' ', p.LastName) AS FullName"),
                    'us.ExpiresAt'
                )
                ->where('us.Token', $token)
                ->where('us.ExpiresAt', '>', now())
                ->first();

            return $userSession;
        } catch (\Exception $e) {
            Log::error("Token verification error: " . $e->getMessage());
            return null;
        }
    }
}