<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    private function generateToken($userId)
    {
        return bin2hex(random_bytes(32)) . '_' . $userId . '_' . time();
    }

    private function storeToken($userId, $token)
    {
        return DB::table('user_sessions')->updateOrInsert(
            ['UserID' => $userId],
            [
                'Token' => $token,
                'ExpiresAt' => now()->addDays(30),
                'CreatedAt' => now(),
            ]
        );
    }

    public function login(Request $request)
    {
        $identifier = $request->identifier;
        $password = $request->password;

        // find user (username or email)
    $user = DB::table('user as u')
        ->join('passwordpolicy as pp', 'u.UserID', '=', 'pp.UserID')
        ->where('u.EmailAddress', $identifier)
        ->select('u.*', 'pp.PasswordHash')
        ->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Invalid username or password.']);
        }

        if ($user->AccountStatus !== 'Active') {
            return response()->json(['success' => false, 'message' => 'Account is inactive.']);
        }

        if (!Hash::check($password, $user->PasswordHash)) {
            return response()->json(['success' => false, 'message' => 'Invalid username or password.']);
        }

        $token = $this->generateToken($user->UserID);

        if (!$this->storeToken($user->UserID, $token)) {
            return response()->json(['success' => false, 'message' => 'Failed to create session.']);
        }

        // store in session (same behavior)
        Session::put('user_id', $user->UserID);
        // Session::put('full_name', $user->FullName);
        Session::put('user_type', $user->UserType);
        Session::put('auth_token', $token);

        return response()->json([
            'success' => true,
            'message' => 'Login successful!',
            'user' => [
                'userId' => $user->UserID,
                // 'fullName' => $user->FullName,
                'userType' => $user->UserType
            ],
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->token;

        DB::table('user_sessions')
            ->where('Token', $token)
            ->delete();

        Session::flush();

        return response()->json([
            'success' => true,
            'message' => 'Logged out'
        ]);
    }
}
