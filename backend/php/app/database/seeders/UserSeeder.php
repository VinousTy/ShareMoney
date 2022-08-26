<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
        'email' => 'guest@example.com',
        'password' => Hash::make(env('GUEST_PASSWORD')),
        'created_at' => '2022/08/07 14:09:10'
      ],
    ]);
  }
}
