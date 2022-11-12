<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
  public function index()
  {
    return response()->json(Auth::user(), 200);
  }

  public function notify()
  {
    $user = Auth::user();
    $notifyArray = [];

    foreach ($user->notifications as $notification) {
      array_push($notifyArray, $notification->data);
    }

    return response()->json($notifyArray, 200);
  }

  public function unNotify(Request $request)
  {
    $user = Auth::user();

    $id = '';

    foreach ($user->notifications as $notification) {
      $id = Notification::where('data->id', $request->id)->get('id');
    }

    $notify = Notification::findOrFail($id[0]->id);
    $notify->delete();

    return response()->json('通知を確認しました。', 200);
  }
}
