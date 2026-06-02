<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

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

        $fotoPath = null;

        if ($googleUser->getAvatar()) {
            $response = Http::get($googleUser->getAvatar());

            if ($response->successful()) {
                $fileName = 'usuarios/google_' . md5($googleUser->getEmail()) . '.jpg';

                Storage::disk('public')->put($fileName, $response->body());

                $fotoPath = $fileName;
            }
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'nombre' => $googleUser->getName(),
                'password' => Hash::make(str()->random(24)),
                'foto' => $fotoPath,
            ]
        );

        $user->update([
            'nombre' => $googleUser->getName(),
            'foto' => $fotoPath,
        ]);

        $token = $user->createToken('google-login')->plainTextToken;

        return redirect(env('FRONTEND_URL') . '/auth/google/callback?' . http_build_query([
            'token' => $token,
        ]));
    }

}
