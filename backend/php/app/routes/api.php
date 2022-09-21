<?php

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\GoogleLoginController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\HouseHoldBook\AccountBookController;
use App\Http\Controllers\Api\HouseHoldBook\BookmarkController;
use App\Http\Controllers\Api\HouseHoldBook\CommentController;
use App\Http\Controllers\Api\HouseHoldBook\ExpenseController;
use App\Http\Controllers\Api\HouseHoldBook\LikeController;
use App\Http\Controllers\Api\HouseHoldBook\PostAccountBookController;
use App\Http\Controllers\Api\HouseHoldBook\PostExpenseController;
use App\Http\Controllers\Api\Profile\ProfileController;
use App\Http\Controllers\Api\User\UserController;
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
Route::get('auth', [GoogleLoginController::class, 'redirect']);
Route::get('auth/callback', [GoogleLoginController::class, 'callback']);

Route::group(['middleware' => ['auth:sanctum']], function () {
  Route::get('user', [UserController::class, 'index']);
  Route::get('profile', [ProfileController::class, 'index'])->name('profile.index');
  Route::get('profile/list', [ProfileController::class, 'list']);
  Route::post('create/profile', [ProfileController::class, 'create'])->name('profile.create');
  Route::put('update/profile/{id}', [ProfileController::class, 'update']);
  Route::get('accountbook', [AccountBookController::class, 'index'])->name('accountbook.index');
  Route::post('create/accountbook', [AccountBookController::class, 'create'])->name('accountbook.create');
  Route::post('edit/accountbook', [AccountBookController::class, 'edit'])->name('accountbook.edit');
  Route::post('detail/accountbook', [AccountBookController::class, 'detail'])->name('accountbook.detail');
  Route::put('update/accountbook/{id}', [AccountBookController::class, 'update']);
  Route::post('destroy/accountbook/{id}', [AccountBookController::class, 'destroy']);
  Route::post('create/expense', [ExpenseController::class, 'create'])->name('expense.create');
  Route::put('update/expense/{id}', [ExpenseController::class, 'update']);
  Route::post('destroy/expense/{id}', [ExpenseController::class, 'destroy']);
  Route::get('accountbook/list', [PostAccountBookController::class, 'index'])->name('postAccountbook.index');
  Route::post('create/postAccountBook', [PostAccountBookController::class, 'create'])->name('postAccountBook.create');
  Route::post('update/postAccountBook/{id}', [PostAccountBookController::class, 'update']);
  Route::post('detail/postAccountBook', [PostAccountBookController::class, 'detail'])->name('postAccountBook.detail');
  Route::post('recomend/accountbook', [PostAccountBookController::class, 'recomend'])->name('postAccountBook.recomend');
  Route::post('create/postExpense', [PostExpenseController::class, 'create'])->name('postExpense.create');
  Route::put('update/postExpense/{id}', [PostExpenseController::class, 'update']);
  Route::post('destroy/postExpense/{id}', [PostExpenseController::class, 'destroy']);
  Route::post('comment', [CommentController::class, 'index'])->name('comment.index');
  Route::post('create/comment', [CommentController::class, 'create'])->name('comment.create');
  Route::post('like', [LikeController::class, 'like'])->name('like/create');
  Route::post('destroy/like', [LikeController::class, 'destroy'])->name('like/destroy');
  Route::get('bookmark/accountbook', [BookmarkController::class, 'index'])->name('bookmark/index');
  Route::post('bookmark', [BookmarkController::class, 'bookmark'])->name('bookmark/create');
  Route::post('destroy/bookmark', [BookmarkController::class, 'destroy'])->name('bookmark/destroy');
});
