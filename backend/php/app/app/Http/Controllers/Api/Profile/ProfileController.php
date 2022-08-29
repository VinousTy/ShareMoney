<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
  public function index()
  {
    $profile = Profile::where('user_id', Auth::id())->get();

    return response()->json($profile, 200);
  }

  public function create(Request $request)
  {
    $request->validate([
      'name' => 'required | string',
      'age' => 'required | integer | between:0,100',
      'job' =>  'required | string',
      'income' =>  'required | string',
      'composition' =>  'required | string',
      'body' =>  'required | string | max:150'
    ]);

    if (!empty($request->img)) {
      $img = $request->img;
      $path = Storage::disk('s3')->putFile('images', $img, 'public');
      $file_path = Storage::disk('s3')->url($path);
    } else {
      $file_path = null;
    }

    Profile::create([
      'name' => $request->name,
      'age' => $request->age,
      'job' => $request->job,
      'income' => $request->income,
      'composition' => $request->composition,
      'body' =>  $request->body,
      'img' => $file_path,
      'user_id' => Auth::id()
    ]);

    return response()->json('プロフィール登録の完了', 200);
  }

  public function update(Request $request, $id)
  {
    $request->validate([
      'name' => 'required | string',
      'age' => 'required | integer | between:0,100',
      'job' =>  'required | string',
      'income' =>  'required | string',
      'composition' =>  'required | string',
      'body' =>  'required | string | max:150'
    ]);

    $img = $request->img;

    $profile = Profile::findOrFail($id);
    $profile->name = $request->name;
    $profile->age = $request->age;
    $profile->job = $request->job;
    $profile->income = $request->income;
    $profile->composition = $request->composition;
    $profile->body = $request->body;
    if (!is_null($img)) {
      $path = Storage::disk('s3')->putFile('images', $img, 'public');
      $file_path = Storage::disk('s3')->url($path);

      $profile->img = $file_path;
    }

    $profile->save();

    return response()->json([
      'profile' => $profile,
      'message' => 'プロフィールの更新が完了しました'
    ], 200);
  }

  public function list()
  {
    $profile = Profile::all();

    return response()->json($profile, 200);
  }
}
