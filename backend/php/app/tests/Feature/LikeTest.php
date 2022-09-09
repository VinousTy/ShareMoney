<?php

namespace Tests\Feature;

use App\Models\Like;
use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class LikeTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestLike()
  {
    $response = $this->post(
      route('like/create'),
    );

    $response->assertStatus(302);
  }

  public function testLikeCreate()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $this->post(
      route('like/create'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response->assertStatus(200);
    $this->assertEquals(1, Like::count());

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('income', 'array')
        ->whereType('costs', 'array')
    );
  }

  public function testLikeDestroy()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $this->post(
      route('like/create'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response = $this->post(
      route('like/destroy'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response->assertStatus(200);
    $this->assertEquals(0, Like::count());

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('income', 'array')
        ->whereType('costs', 'array')
    );
  }
}
