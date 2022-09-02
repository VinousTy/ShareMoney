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

  public $incrementing = false;

  protected $keyType = 'string';

  protected static function booted()
  {
    static::creating(function (Bookmark $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function postAccountBooks()
  {
    return $this->belongsTo(PostAccountBook::class);
  }
}
