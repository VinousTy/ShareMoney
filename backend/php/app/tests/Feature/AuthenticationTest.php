<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();

    $this->user = User::create([
      'email' => 'dummy@main.com',
      'password' => bcrypt('password'),
    ]);
  }

  public function testLogin()
  {
    $response = $this->json('POST', route('login'), [
      'email' => 'dummy@main.com',
      'password' => 'password',
    ]);

    $response->assertStatus(200);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('access_token', 'string')
        ->whereType('message', 'string')
        ->etc()
    );
  }
}
