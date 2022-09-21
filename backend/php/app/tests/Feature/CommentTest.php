<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Comment;
use App\Models\PostAccountBook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class CommentTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestCommentIndex()
  {
    $response = $this->post(
      route('comment.index'),
    );

    $response->assertStatus(302);
  }

  public function testCommentIndex()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    PostAccountBook::factory()->create();
    Comment::factory()->create();

    $response = $this->post(
      route('comment.index'),
    );

    $response->assertStatus(200)->assertJsonCount(1);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('comment', 'array')
    );
  }

  public function testCommentCreate()
  {
    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $postAccountBook = PostAccountBook::factory()->create();

    $response = $this->post(
      route('comment.create'),
      [
        'body' => 'test',
        'user_id' => $user->id,
        'post_account_book_id' => $postAccountBook->id,
      ]
    );

    $response->assertStatus(200)->assertJsonCount(1);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('comment', 'array')
    );
  }
}
