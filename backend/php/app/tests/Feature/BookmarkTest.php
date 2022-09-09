<?php

namespace Tests\Feature;

use App\Models\Bookmark;
use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class BookmarkTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestBookmark()
  {
    $response = $this->post(
      route('bookmark/create'),
    );

    $response->assertStatus(302);
  }

  public function testBookmarkCreate()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $this->post(
      route('bookmark/create'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response->assertStatus(200);
    $this->assertEquals(1, Bookmark::count());

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('income', 'array')
        ->whereType('costs', 'array')
    );
  }

  public function testBookmarkDestroy()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $this->post(
      route('bookmark/create'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response = $this->post(
      route('bookmark/destroy'),
      [
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response->assertStatus(200);
    $this->assertEquals(0, Bookmark::count());

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('accountBook', 'array')
        ->whereType('income', 'array')
        ->whereType('costs', 'array')
    );
  }
}
