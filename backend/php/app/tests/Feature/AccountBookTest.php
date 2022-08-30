<?php

namespace Tests\Feature;

use App\Models\AccountBook;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AccountBookTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestAccountBookIndex()
  {
    $response = $this->get(
      route('accountbook.index'),
    );

    $response->assertStatus(302);
  }

  public function testAuthAccountBookIndex()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $accountBook = AccountBook::factory()->create();

    $response = $auth->get(route('accountbook.index'));

    $response->assertStatus(200)->assertJsonCount(1);
  }

  public function testAuthAccountBookCreate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $response = $auth->post(route('accountbook.create'), [
      'date' => '2022/08/13 14:09:10',
      'monthly_income' => 200000,
    ]);

    $response->assertStatus(200);
  }

  public function testAuthAccountBookUpdate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $accountBook = AccountBook::factory()->create();

    $response = $auth->put('/api/update/accountbook/' . $accountBook->id, [
      'date' => '2022/09/13 14:09:10',
      'monthly_income' => 300000,
    ]);

    $response->assertStatus(200);
  }

  public function testAuthAccountBookEdit()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $response = $auth->post(route('accountbook.edit'), [
      'date' => '2022/08/13 14:09:10',
    ]);

    $response->assertStatus(200);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('costs', 'array')
        ->whereType('totalCost', 'array')
    );
  }

  public function testAuthAccountBookDestory()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $accountBook = AccountBook::factory()->create();

    $response = $auth->post('/api/destroy/accountbook/' . $accountBook->id, [
      'date' => '2022/08/13 14:09:10',
      'monthly_income' => 200000,
    ]);

    $response->assertStatus(200);

    $this->assertEquals(0, AccountBook::count());

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('costs', 'array')
        ->whereType('totalCost', 'array')
        ->etc()
    );
  }
}
