<?php

namespace App\Http\Controllers\Api\HouseHoldBook;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
  public function index(Request $request)
  {
    $comments = Comment::where('post_account_book_id', $request->post_account_book_id,)
      ->get();

    return response()->json([
      'comment' => $comments
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

    return response()->json([
      'comment' => $comment
    ], 200);
  }
}
