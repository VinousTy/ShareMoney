<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\PostExpense;
use Illuminate\Http\Request;

class PostExpenseController extends Controller
{
  public function create(Request $request)
  {
    $expenses = json_decode($request->expenses, true);

    if ($expenses) {
      foreach ($expenses as $expense) {
        PostExpense::create([
          "expenseItem" => $expense['expenseItem'],
          "cost" => (int)$expense['cost'],
          "post_account_book_id" => $request['post_account_book_id'],
        ]);
      }
    }

    return response()->json('当月の家計簿をシェアしました', 200);
  }

  public function update(Request $request, $id)
  {
    $expenses = json_decode($request->expenses);

    $expensesDb = PostExpense::where('post_account_book_id', $id)->get();

    foreach ($expenses as $index => $expense) {
      foreach ($expensesDb as $index => $expenseDb) {
        if ($expenseDb->expenseItem === $expense->expenseItem) {
          $expenseDb->expenseItem = $expense->expenseItem;
          $expenseDb->cost = $expense->cost;
          $expenseDb->save();
        }
      }
    }

    return response()->json('sucess', 200);
  }

  public function destroy(Request $request, $id)
  {
    $expenses = json_decode($request->expenses);

    $expensesDb = PostExpense::where('post_account_book_id', $id)->get();

    foreach ($expenses as $index => $expense) {
      foreach ($expensesDb as $index => $expenseDb) {
        if ($expenseDb->expenseItem === $expense->expenseItem) {
          $expenseDb->delete();
        }
      }
    }

    return response()->json('sucess', 200);
  }
}
