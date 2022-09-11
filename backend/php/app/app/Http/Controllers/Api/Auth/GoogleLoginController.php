<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleLoginController extends Controller
{
  public function redirect()
  {
    return response()->json([
      'url' => Socialite::driver('google')
        ->stateless()
        ->redirect()
        ->getTargetUrl(),
    ]);
  }

  public function callback()
  {
    try {
      /** @var SocialiteUser $socialiteUser */
      $socialiteUser = Socialite::driver('google')->stateless()->user();
    } catch (ClientException $e) {
      return response()->json(['error' => 'Invalid credentials provided.'], 422);
    }

    /** @var User $user */
    $user = User::where('email', '=', $socialiteUser->getEmail())->first();
    if (!empty($user)) {
      return response()->json([
        'user' => $user,
        'access_token' => $user->createToken('google-token')->plainTextToken,
        'type' => 'login',
      ]);
    } else {
      $user = User::query()
        ->firstOrCreate(
          [
            'email' => $socialiteUser->getEmail(),
          ],
          [
            'email_verified_at' => now(),
          ]
        );
      return response()->json([
        'user' => $user,
        'access_token' => $user->createToken('google-token')->plainTextToken,
        'type' => 'create',
      ]);
    }
  }
}
