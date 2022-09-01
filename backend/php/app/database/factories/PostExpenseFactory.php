<?php

namespace Database\Factories;

use App\Models\PostAccountBook;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostExpenseFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    $accountBook_id = PostAccountBook::select('id')->get();

    return [
      'expenseItem' => '住居費',
      'cost' => 10000,
      'post_account_book_id' => $accountBook_id[0],
    ];
  }
}
