<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountBookFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    $user_id = User::select('id')->get();

    return [
      'date' => '2022/08/13 14:09:10',
      'monthly_income' => 200000,
      'user_id' => $user_id[0]
    ];
  }
}
