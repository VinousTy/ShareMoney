<?php

namespace App\Notifications;

use App\Models\PostAccountBook;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class InformationNotification extends Notification
{
  use Queueable;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct($user, $comment)
  {
    $this->user = $user;
    $this->profile = $user->profile;
    $this->postAccountBook = $comment->postAccountBook;
    $this->comment = $comment;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['mail', 'database'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */
  public function toMail($notifiable)
  {
    return (new MailMessage)
      // ->line('The introduction to the notification.')
      // ->action('Notification Action', url('/'))
      // ->line('Thank you for using our application!');
      ->subject('【ShareMoney】あなたの家計簿にコメントがつきました')
      ->view('emails.comment-notification', [
        'url' => url(config('app.url') . '/accountBook/detail/' . $this->user->id . '/' . $this->postAccountBook->date . '/' . $this->postAccountBook->id),
        'name' => $this->profile->name,
        'email' => $this->user->email
      ]);
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    return [
      'id' => Str::uuid(),
      'user_id' => $this->user->id,
      'post_account_book_id' => $this->postAccountBook->id,
      'date' => $this->postAccountBook->date,
      'created_at' => $this->comment->created_at
    ];
  }
}
