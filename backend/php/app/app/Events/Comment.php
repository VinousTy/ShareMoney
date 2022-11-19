<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Comment implements ShouldBroadcast
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public $comment;

  public function __construct($comment)
  {
    $this->comment = $comment;
  }

  public function broadcastOn()
  {
    return ['comment'];
  }

  public function broadcastAs()
  {
    return 'message';
  }
}