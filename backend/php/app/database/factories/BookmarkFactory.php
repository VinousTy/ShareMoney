<?php

namespace Database\Factories;

use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookmarkFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    $user_id = User::select('id')->get();
    $accountBook_id = PostAccountBook::select('id')->get();

    return [
      'user_id' => $user_id[0],
      'post_account_book_id' => $accountBook_id[0],
    ];
  }
}
