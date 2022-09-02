<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\PostAccountBook;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
  public function bookmark(Request $request)
  {
    Bookmark::create([
      'user_id' => $request->user_id,
      'post_account_book_id' => $request->post_account_book_id,
    ]);

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

  public function destroy(Request $request)
  {
    $matchThese = ['user_id' => $request->user_id, 'post_account_book_id' => $request->post_account_book_id];
    $bookmark = Bookmark::where($matchThese)->first();

    $bookmark->delete();
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
