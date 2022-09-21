<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\PostAccountBook;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostAccountBookController extends Controller
{
  public function index(Request $request)
  {
    $name = $request->name;
    $income = $request->income;
    $job = $request->job;
    $composition = $request->composition;

    if (empty($name || $income || $job || $composition)) {
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
    }
  }

  public function create(Request $request)
  {
    $postAccountBook = PostAccountBook::create([
      'date' => $request->date,
      'monthly_income' => $request->monthly_income,
      'user_id' => Auth::id(),
    ]);

    return response()->json([
      'message' => '家計簿をシェアしました',
      'post_account_book' => $postAccountBook
    ], 200);
  }

  public function detail(Request $request)
  {
    $matchThese = [
      'user_id' => Auth::id(),
      'date' => $request->date,
    ];

    $postAccountBook = PostAccountBook::where($matchThese)
      ->get();

    $costs = PostAccountBook::joinPostExpenses()
      ->selectRaw('post_expenses.expenseItem, sum(cost) as cost')
      ->where($matchThese)
      ->groupBy('expenseItem')
      ->get();

    $totalCost = PostAccountBook::joinPostExpenses()
      ->selectRaw('sum(post_expenses.cost) as cost')
      ->where($matchThese)
      ->get();

    return response()->json([
      'accountBook' => $postAccountBook,
      'costs' => $costs,
      'totalCost' => $totalCost,
    ], 200);
  }

  public function update(Request $request, $id)
  {
    $postAccountBook = PostAccountBook::findOrFail($id);
    $postAccountBook->date = $request->date;
    $postAccountBook->monthly_income = $request->monthly_income;
    $postAccountBook->user_id = Auth::id();

    $postAccountBook->save();

    return response()->json('家計簿を更新しました', 200);
  }

  public function recomend(Request $request)
  {

    $name = $request->name;
    $job = $request->job;
    $income = $request->income;
    $composition = $request->composition;

    $matchThese = [
      'profiles.job' => $request->job,
      'profiles.income' => $request->income,
      'profiles.composition' => $request->composition,
    ];

    $satisfyUser = PostAccountBook::with(['likes', 'bookmarks'])
      ->joinProfiles()
      ->where(function ($query) use ($job, $income, $composition) {
        $query->where('profiles.job', '=', $job)
          ->orWhere('profiles.income', '=', $income)
          ->orWhere('profiles.composition', '=', $composition);
      })->where(function ($query) use ($name) {
        $query->where('profiles.name', '<>', $name);
      })->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);

    $satisfyUserCosts = Profile::join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where(function ($query) use ($job, $income, $composition) {
        $query->where('profiles.job', '=', $job)
          ->orWhere('profiles.income', '=', $income)
          ->orWhere('profiles.composition', '=', $composition);
      })->where(function ($query) use ($name) {
        $query->where('profiles.name', '<>', $name);
      })
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id')
      ->get();

    if (isset($satisfyUser)) {
      return response()->json([
        'accountBook' => $satisfyUser,
        'costs' => $satisfyUserCosts,
      ], 200);
    }
  }
}
