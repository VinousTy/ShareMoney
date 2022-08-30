<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
  public function create(Request $request)
  {
    $expenses = json_decode($request->expenses, true);

    if ($expenses) {
      foreach ($expenses as $expense) {
        Expense::create([
          "expenseItem" => $expense['expenseItem'],
          "cost" => (int)$expense['cost'],
          "account_book_id" => (int)$request['account_book_id'],
        ]);
      }
    }

    return response()->json('success', 200);
  }

  public function update(Request $request, $id)
  {

    $expenses = json_decode($request->expenses);

    $expensesDb = Expense::where('account_book_id', $id)->get();

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
    $expensesDb = Expense::findOrFail($id);
    $expensesDb->delete();

    return response()->json('delete', 200);
  }
}
