<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
  public function login(Request $request)
  {
    $credentials = $request->validate([
      'email' => 'required|string|email|max:255|',
      'password' => 'required'
    ]);

    if (Auth::attempt($credentials)) {
      $token = $request->user()->createToken('token')->plainTextToken;
      return response()->json([
        'access_token' => $token,
        'message' => 'ログインしました'
      ], 200);
    }

    return response()->json(['api_token' => null], 401);
  }
}
