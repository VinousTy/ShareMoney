<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class Bookmark extends Model
{
  use HasFactory;

  protected $fillable = [
    'user_id',
    'post_account_book_id'
  ];

  public function postAccountBooks()
  {
    return $this->belongsTo(PostAccountBook::class);
  }

  public function scopeLoginUserBookmark($query)
  {
    return $query->join('post_account_books', 'post_account_books.id', '=', 'bookmarks.post_account_book_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where('bookmarks.user_id', Auth::id())
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
  }
}
