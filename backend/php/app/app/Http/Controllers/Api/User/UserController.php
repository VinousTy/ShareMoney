<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
  public function index()
  {
    return response()->json(Auth::user(), 200);
  }
}
