<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
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
      'name' => 'dummy',
      'age' => 10,
      'job' => 'その他',
      'income' => '200~400万円',
      'composition' => 'その他',
      'body' =>  'dummy',
      'img' => '',
      'user_id' => $user_id[0]
      // 'user_id' => 'c293a547-30bd-4122-8c19-60d2a405ec9d'
    ];
  }
}
