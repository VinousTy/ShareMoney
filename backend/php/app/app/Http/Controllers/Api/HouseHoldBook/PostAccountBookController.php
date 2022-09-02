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
    $accountBook = PostAccountBook::with(['likes', 'bookmarks'])->get();

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

    $costs = PostAccountBook::join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_expenses.expenseItem, sum(cost) as cost')
      ->where($matchThese)
      ->groupBy('expenseItem')
      ->get();

    $totalCost = PostAccountBook::join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
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
}
