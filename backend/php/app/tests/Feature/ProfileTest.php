<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ProfileTest extends TestCase
{
  use RefreshDatabase;

  public function testGuestProfileIndex()
  {
    $response = $this->get(
      route('profile.index'),
    );

    $response->assertStatus(302);
  }

  public function testAuthProfileIndex()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $profile = Profile::factory()->create();

    $response = $auth->get(route('profile.index'));

    $response->assertStatus(200)->assertJsonCount(1);
  }

  public function testAuthProfileCreate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $response = $auth->post(route('profile.create'), [
      'name' => 'dummy',
      'age' => 20,
      'job' => 'その他',
      'income' => '200~400万円',
      'composition' => 'その他',
      'body' =>  'dummy',
      'img' => '',
    ]);

    $response->assertStatus(200);
  }

  public function testAuthProfileUpdate()
  {

    $user = User::factory()->create();

    $auth = $this->actingAs($user);

    $profile = Profile::factory()->create();

    $response = $auth->put('/api/update/profile/' . $profile->id, [
      'name' => 'dummy_update',
      'age' => 20,
      'job' => '不動産',
      'income' => '400~600万円',
      'composition' => '一人暮らし',
      'body' =>  'dummy_update',
      'img' => '',
    ]);

    $response->assertStatus(200);

    $response->assertJson(
      fn (AssertableJson $json) =>
      $json->whereType('profile', 'array')
        ->whereType('message', 'string')
    );
  }
}
