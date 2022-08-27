<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
  public function resetPassword()
  {
    $credentials = request()->validate([
      'email' => 'required|email',
      'token' => 'required|string',
      'password' => 'required|string'
    ]);

    $reset_password_status = Password::reset($credentials, function ($user, $password) {
      $user->password = bcrypt($password);
      $user->save();
    });

    if ($reset_password_status == Password::INVALID_TOKEN) {
      return ['パスワードの変更に失敗しました'];
    }

    return ['パスワードの変更が完了しました'];
  }
}
