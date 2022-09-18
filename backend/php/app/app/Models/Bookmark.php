<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
}
