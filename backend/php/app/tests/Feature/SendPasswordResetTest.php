<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendPasswordResetTest extends TestCase
{
  use RefreshDatabase;
  use WithFaker;

  public function testResetPassword()
  {
    Notification::fake();

    $user = User::factory()->create();

    $params = ['email' => $user->email];
    $response = $this->post('/api/password/request', $params);
    $response->assertStatus(201);
  }

  public function testResetPasswordMissingUser()
  {
    Notification::fake();

    $user = User::factory()->create();

    $params = ['email' => 'password_reset@password.com'];
    $response = $this->post('/api/password/request', $params);
    $response->assertStatus(401);
  }
}
