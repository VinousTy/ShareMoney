<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Events\Comment as EventsComment;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Notifications\InformationNotification;
use Illuminate\Http\Request;

class CommentController extends Controller
{
  public function index(Request $request)
  {
    $comments = Comment::where('post_account_book_id', $request->post_account_book_id,)
      ->get();

    return response()->json([
      'comment' => $comments,
    ], 200);
  }

  public function create(Request $request)
  {
    $request->validate([
      'body' => 'required | string',
    ]);

    $comment = Comment::create([
      'body' =>  $request->body,
      'user_id' => $request->user_id,
      'post_account_book_id' => $request->post_account_book_id,
    ]);

    $user = $comment->postAccountBook->user;
    $comment = $comment;

    event(new EventsComment($comment));

    $user->notify(
      new InformationNotification($user, $comment)
    );

    return response()->json([
      'comment' => $comment,
    ], 200);
  }
}
