<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\PostAccountBook;
use App\Models\Profile;
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

    Auth::user()->bookmark($request->post_account_book_id);

    $name = $request->name;
    $income = $request->income;
    $job = $request->job;
    $composition = $request->composition;
    $bookmark = $request->bookmark;

    if (empty($name || $income || $job || $composition || $bookmark)) {
      $accountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->get();

      $income = PostAccountBook::selectRaw('date, user_id, sum(monthly_income) as monthly_income')
        ->groupBy('date', 'user_id')
        ->get();

      $costs = PostAccountBook::joinPostExpenses()
        ->selectRaw('date ,expenseItem, user_id, sum(cost) as cost')
        ->groupBy('date', 'expenseItem', 'user_id')
        ->get();

      return response()->json([
        'accountBook' => $accountBook,
        'income' => $income,
        'costs' => $costs
      ], 200);
    } else if (!empty($name)) {

      $queryUserAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchName($name)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryUserIncome = Profile::searchIncomeName($name)->get();

      $queryUserCosts = Profile::searchCostName($name)->get();

      return response()->json([
        'accountBook' => $queryUserAccountBook,
        'income' => $queryUserIncome,
        'costs' =>  $queryUserCosts
      ], 200);
    } else if (!empty($income)) {

      $queryIncomeAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchIncome($income)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryIncome = Profile::searchIncome($income)->get();

      $queryIncomeCosts = Profile::searchCostIncome($income)
        ->get();

      return response()->json([
        'accountBook' => $queryIncomeAccountBook,
        'income' => $queryIncome,
        'costs' =>  $queryIncomeCosts
      ], 200);
    } else if (!empty($job)) {

      $queryJobAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchJob($job)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryJobIncome = Profile::searchJobIncome($job)->get();

      $queryJobCosts = Profile::searchJobCost($job)->get();

      return response()->json([
        'accountBook' => $queryJobAccountBook,
        'income' => $queryJobIncome,
        'costs' =>  $queryJobCosts
      ], 200);
    } else if (!empty($composition)) {

      $queryCompositionAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchComposition($composition)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryCompositionIncome = Profile::searchCompositionIncome($composition)->get();

      $queryCompositionCosts = Profile::searchCompositionCost($composition)->get();

      return response()->json([
        'accountBook' => $queryCompositionAccountBook,
        'income' => $queryCompositionIncome,
        'costs' =>  $queryCompositionCosts
      ], 200);
    } else if (!empty($bookmark)) {

      $bookmarkAccountBooks = PostAccountBook::with(['likes', 'bookmarks'])
        ->joinBookmarks()
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $bookmarkCosts = Bookmark::loginUserBookmark()
        // ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id')
        ->get();
    }
    return response()->json([
      'accountBook' => $bookmarkAccountBooks,
      'costs' =>  $bookmarkCosts
    ], 200);
  }

  public function destroy(Request $request)
  {
    Auth::user()->unBookmark($request->post_account_book_id);

    $name = $request->name;
    $income = $request->income;
    $job = $request->job;
    $composition = $request->composition;
    $bookmark = $request->bookmark;

    if (empty($name || $income || $job || $composition || $bookmark)) {
      $accountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->get();

      $income = PostAccountBook::selectRaw('date, user_id, sum(monthly_income) as monthly_income')
        ->groupBy('date', 'user_id')
        ->get();

      $costs = PostAccountBook::joinPostExpenses()
        ->selectRaw('date ,expenseItem, user_id, sum(cost) as cost')
        ->groupBy('date', 'expenseItem', 'user_id')
        ->get();

      return response()->json([
        'accountBook' => $accountBook,
        'income' => $income,
        'costs' => $costs
      ], 200);
    } else if (!empty($name)) {

      $queryUserAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchName($name)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryUserIncome = Profile::searchIncomeName($name)
        ->get();

      $queryUserCosts = Profile::searchCostName($name)
        ->get();

      return response()->json([
        'accountBook' => $queryUserAccountBook,
        'income' => $queryUserIncome,
        'costs' =>  $queryUserCosts
      ], 200);
    } else if (!empty($income)) {

      $queryIncomeAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchIncome($income)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryIncome = Profile::searchIncome($income)->get();

      $queryIncomeCosts = Profile::searchCostIncome($income)
        ->get();

      return response()->json([
        'accountBook' => $queryIncomeAccountBook,
        'income' => $queryIncome,
        'costs' =>  $queryIncomeCosts
      ], 200);
    } else if (!empty($job)) {

      $queryJobAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchJob($job)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryJobIncome = Profile::searchJobIncome($job)->get();

      $queryJobCosts = Profile::searchJobCost($job)->get();

      return response()->json([
        'accountBook' => $queryJobAccountBook,
        'income' => $queryJobIncome,
        'costs' =>  $queryJobCosts
      ], 200);
    } else if (!empty($composition)) {

      $queryCompositionAccountBook = PostAccountBook::with(['likes', 'bookmarks'])
        ->searchComposition($composition)
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $queryCompositionIncome = Profile::searchCompositionIncome($composition)->get();

      $queryCompositionCosts = Profile::searchCompositionCost($composition)->get();

      return response()->json([
        'accountBook' => $queryCompositionAccountBook,
        'income' => $queryCompositionIncome,
        'costs' =>  $queryCompositionCosts
      ], 200);
    } else if (!empty($bookmark)) {

      $bookmarkAccountBooks = PostAccountBook::with(['likes', 'bookmarks'])
        ->joinBookmarks()
        ->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

      $bookmarkCosts = Bookmark::loginUserBookmark()->get();
    }
    return response()->json([
      'accountBook' => $bookmarkAccountBooks,
      'costs' =>  $bookmarkCosts
    ], 200);
  }
}
