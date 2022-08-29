<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfileSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    DB::table('profiles')->insert([
      [
        'id' => (string)Str::uuid(),
        'name' => 'ゲストユーザー',
        'age' => 20,
        'job' => 'その他',
        'income' => '200~400万円',
        'composition' => 'その他',
        'body' =>  'ゲストユーザーとしてログインしています。ゲストユーザーのため、各種投稿やユーザー情報の変更等の一部機能の使用は制限されております。',
        'img' => '',
        'user_id' => '8f2ce26a-8923-467c-b844-fae0bfa1b20d'
      ],
    ]);
  }
}
