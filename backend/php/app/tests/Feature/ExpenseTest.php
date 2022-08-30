<?php

namespace Tests\Feature;

use App\Models\AccountBook;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestExpenseCreate()
  {
    $response = $this->post(
      route('expense.create'),
    );

    $response->assertStatus(302);
  }

  public function testAuthExpenseCreate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $accountBook = AccountBook::factory()->create();

    $response = $auth->post(route('expense.create'), [
      json_encode([
        'expenses' => ['expenseItem' => '住居費', 'cost' => 10000]
      ]),
      "account_book_id" => $accountBook->id,
    ]);

    $response->assertStatus(200);
  }

  public function testAuthExpenseDestory()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $accountBook = AccountBook::factory()->create();

    $expense = Expense::factory()->create();

    $response = $auth->post('/api/destroy/expense/' . $expense->id, [
      json_encode([
        'expenses' => ['expenseItem' => '住居費', 'cost' => 10000]
      ]),
      "account_book_id" => $expense->account_book_id,
    ]);

    $response->assertStatus(200);

    $this->assertEquals(0, Expense::count());
  }
}
