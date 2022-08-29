<?php

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Profile\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post("/register", [RegisterController::class, "register"]);
Route::post("/login", [LoginController::class, "login"])->name('login');
Route::post('password/request', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.request');
Route::post('password/reset/{token}', [ResetPasswordController::class, 'resetPassword'])->name('password.reset');

Route::group(['middleware' => ['auth:sanctum']], function () {
  Route::get('profile', [ProfileController::class, 'index'])->name('profile.index');
  Route::get('profile/list', [ProfileController::class, 'list']);
  Route::post('create/profile', [ProfileController::class, 'create'])->name('profile.create');
  Route::put('update/profile/{id}', [ProfileController::class, 'update']);
});
