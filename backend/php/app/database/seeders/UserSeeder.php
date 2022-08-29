<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    DB::table('users')->insert([
      [
        'id' => '8f2ce26a-8923-467c-b844-fae0bfa1b20d',
        'email' => 'guest@example.com',
        'password' => Hash::make(env('GUEST_PASSWORD')),
        'created_at' => '2022/08/07 14:09:10'
      ],
    ]);
  }
}
