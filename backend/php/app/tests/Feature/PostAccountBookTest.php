<?php

namespace Tests\Feature;

use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class PostAccountBookTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestPostAccountBookCreate()
  {
    $response = $this->post(
      route('postAccountBook.create'),
    );

    $response->assertStatus(302);
  }

  public function testAuthPostAccountBookCreate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $response = $auth->post(route('postAccountBook.create'), [
      'date' => '2022-08',
      'monthly_income' => 300000,
      'user_id' => 1
    ]);

    $response->assertStatus(200);
    $this->assertEquals(1, PostAccountBook::count());
  }

  public function testAuthPostAccountBookUpdate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $auth->post('/api/update/postAccountBook/' . $postAccountBook->id, [
      'date' => '2022-09',
      'monthly_income' => 200000,
      'user_id' => 1
    ]);

    $response->assertStatus(200);
  }

  public function testAuthPostAccountBookDetail()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $auth->post(route('postAccountBook.detail'), [
      'date' => '2022-08',
    ]);

    $response->assertStatus(200);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('costs', 'array')
        ->whereType('totalCost', 'array')
    );
  }
}
