<?php

namespace Tests\Feature;

use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostExpenseTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestExpenseCreate()
  {
    $response = $this->post(
      route('postExpense.create'),
    );

    $response->assertStatus(302);
  }

  public function testAuthExpenseCreate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $auth->post(route('postExpense.create'), [
      json_encode([
        'expenses' => ['expenseItem' => '住居費', 'cost' => 12000]
      ]),
      "account_book_id" => $postAccountBook->id,
    ]);

    $response->assertStatus(200);
  }
}
