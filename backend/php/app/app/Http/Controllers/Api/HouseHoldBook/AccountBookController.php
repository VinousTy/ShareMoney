<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\AccountBook;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountBookController extends Controller
{
  public function index()
  {
    $cost = AccountBook::with('expenses')->get();

    return response()->json($cost, 200);
  }

  public function create(Request $request)
  {
    if (empty($request->monthly_income)) {
      $accountBook = AccountBook::create([
        'date' => $request->date,
        'monthly_income' => 0,
        'user_id' => Auth::id()
      ]);
    } else {
      $accountBook = AccountBook::create([
        'date' => $request->date,
        'monthly_income' => $request->monthly_income,
        'user_id' => Auth::id()
      ]);
    }

    return response()->json($accountBook, 200);
  }

  public function edit(Request $request)
  {
    $accountBook = AccountBook::with('expenses')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->get();

    $costs = AccountBook::join('expenses', 'account_books.id', '=', 'expenses.account_book_id')
      ->selectRaw('expenseItem, sum(cost) as cost')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->groupBy('expenseItem')
      ->get();

    $totalCost = AccountBook::join('expenses', 'account_books.id', '=', 'expenses.account_book_id')
      ->selectRaw('sum(cost) as cost')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->get();

    return response()->json([
      'accountBook' => $accountBook,
      'costs' => $costs,
      'totalCost' => $totalCost,
    ], 200);
  }

  public function update(Request $request, $id)
  {

    $accountBook = AccountBook::findOrFail($id);
    $accountBook->date = $request->date;
    $accountBook->monthly_income = $request->monthly_income;

    $accountBook->save();

    return response()->json('家計簿の更新が完了しました', 200);
  }

  public function destroy(Request $request, $id)
  {
    $selectAccountBook = AccountBook::findOrFail($id);
    $selectAccountBook->delete();

    $accountBook = AccountBook::with('expenses')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->get();

    $costs = AccountBook::join('expenses', 'account_books.id', '=', 'expenses.account_book_id')
      ->selectRaw('expenseItem, sum(cost) as cost')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->groupBy('expenseItem')
      ->get();

    $totalCost = AccountBook::join('expenses', 'account_books.id', '=', 'expenses.account_book_id')
      ->selectRaw('sum(cost) as cost')
      ->where('user_id', Auth::id())
      ->where('date', 'like', "%$request->date%")
      ->get();

    return response()->json([
      'accountBook' => $accountBook,
      'costs' => $costs,
      'totalCost' => $totalCost,
    ], 200);
  }
}
