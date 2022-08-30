<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountBookSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $user_id = User::select('id')->get();

    DB::table('account_books')->insert([
      [
        'id' => Str::uuid(),
        'date' => '2022/08/21 14:09:10',
        'monthly_income' => 300000,
        'user_id' => $user_id[0]->id
      ],
    ]);
  }
}
