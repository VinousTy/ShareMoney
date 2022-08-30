<?php

namespace Database\Seeders;

use App\Models\AccountBook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExpenseSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $accountBook_id = AccountBook::select('id')->get();

    DB::table('expenses')->insert([
      [
        'id' => Str::uuid(),
        'expenseItem' => '住居費',
        'cost' => 50000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
      [
        'id' => Str::uuid(),
        'expenseItem' => '水道光熱費',
        'cost' => 30000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
      [
        'id' => Str::uuid(),
        'expenseItem' => '通信費',
        'cost' => 10000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
      [
        'id' => Str::uuid(),
        'expenseItem' => '保険料',
        'cost' => 20000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
      [
        'id' => Str::uuid(),
        'expenseItem' => '食費',
        'cost' => 21000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
      [
        'id' => Str::uuid(),
        'expenseItem' => '交際費',
        'cost' => 8000,
        'account_book_id' => $accountBook_id[0]->id,
      ],
    ]);
  }
}
