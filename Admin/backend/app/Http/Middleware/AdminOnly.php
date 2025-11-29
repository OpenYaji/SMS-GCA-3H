<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->auth_user;

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required'
            ], 401);
        }

        // Check if user has admin privileges
        if (!$this->isAdmin($user['userType'])) {
            return response()->json([
                'success' => false,
                'message' => 'Admin access required. Your user type: ' . $user['userType']
            ], 403);
        }

        return $next($request);
    }

    /**
     * Check if user type has admin privileges
     */
    private function isAdmin(string $userType): bool
    {
        // Define which user types are considered admin
        $adminUserTypes = ['Admin'];
        
        return in_array($userType, $adminUserTypes);
    }
}