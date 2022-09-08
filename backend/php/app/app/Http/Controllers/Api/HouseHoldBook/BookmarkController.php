<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\PostAccountBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
  public function index()
  {
    $bookmarkAccountBooks = PostAccountBook::with(['likes', 'bookmarks'])
      ->join('bookmarks', 'post_account_books.id', '=', 'bookmarks.post_account_book_id')
      ->where('bookmarks.user_id', Auth::id())
      ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

    $bookmarkCosts = Bookmark::join('post_account_books', 'post_account_books.id', '=', 'bookmarks.post_account_book_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where('bookmarks.user_id', Auth::id())
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id')
      ->get();

    return response()->json([
      'accountBook' => $bookmarkAccountBooks,
      'costs' =>  $bookmarkCosts
    ], 200);
  }

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
