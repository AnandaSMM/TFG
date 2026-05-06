<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->with([
            'prompt' => 'select_account',
        ])->redirect();    
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'nombre' => $googleUser->getName(),
                'password' => Hash::make(str()->random(24)),
            ]
        );

        $token = $user->createToken('google-login')->plainTextToken;
        return redirect(env('FRONTEND_URL') . '/auth/google/callback?' . http_build_query([
            'token' => $token,
            'user' => json_encode($user),
        ]));

    }

}
