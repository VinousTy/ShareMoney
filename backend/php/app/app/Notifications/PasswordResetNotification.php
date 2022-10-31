<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetNotification extends ResetPassword
{
  use Queueable;

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */

  public function toMail($notifiable)
  {
    if (static::$toMailCallback) {
      return call_user_func(static::$toMailCallback, $notifiable, $this->token);
    }

    return (new MailMessage())
      ->subject('パスワードリセット通知')
      ->view('emails.password-reset', [
        'reset_url' => url(config('app.url') . '/password/reset/?token=' . $this->token . '&email=' . $notifiable->getEmailForPasswordReset()),
        'token' => $this->token,
        'email' => $notifiable->getEmailForPasswordReset(), false
      ]);
  }
}
