<?php

namespace Database\Factories;

use App\Models\AccountBook;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    $accountBook_id = AccountBook::select('id')->get();

    return [
      'expenseItem' => '住居費',
      'cost' => 10000,
      'account_book_id' => $accountBook_id[0],
    ];
  }
}
