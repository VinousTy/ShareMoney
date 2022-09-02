<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\PostAccountBook;
use Illuminate\Http\Request;

class LikeController extends Controller
{
  public function index()
  {
    $like = Like::all();
    return response()->json($like, 200);
  }

  public function like(Request $request)
  {
    $like = Like::create([
      'user_id' => $request->user_id,
      'post_account_book_id' => $request->post_account_book_id,
    ]);


    $accountBook = PostAccountBook::with(['likes', 'bookmark'])
      ->get();

    $income = PostAccountBook::selectRaw('date, user_id, sum(monthly_income) as monthly_income')
      ->groupBy('date', 'user_id')
      ->get();

    $costs = PostAccountBook::join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('date ,expenseItem, user_id, sum(cost) as cost')
      ->groupBy('date', 'expenseItem', 'user_id')
      ->get();

    return response()->json([
      'accountBook' => $accountBook,
      'income' => $income,
      'costs' => $costs
    ], 200);
  }

  public function destroy(Request $request)
  {
    $matchThese = ['user_id' => $request->user_id, 'post_account_book_id' => $request->post_account_book_id];
    $like = Like::where($matchThese)->first();

    $like->delete();

    $accountBook = PostAccountBook::with(['likes', 'bookmarks'])
      ->get();

    $income = PostAccountBook::selectRaw('date, user_id, sum(monthly_income) as monthly_income')
      ->groupBy('date', 'user_id')
      ->get();

    $costs = PostAccountBook::join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('date ,expenseItem, user_id, sum(cost) as cost')
      ->groupBy('date', 'expenseItem', 'user_id')
      ->get();

    return response()->json([
      'accountBook' => $accountBook,
      'income' => $income,
      'costs' => $costs
    ], 200);
  }
}
