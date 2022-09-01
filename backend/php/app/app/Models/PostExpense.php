<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostExpense extends Model
{
  use HasFactory;

  protected $fillable = [
    'id',
    "expenseItem",
    'cost',
    'post_account_book_id',
  ];

  public $incrementing = false;

  protected $keyType = 'string';

  protected static function booted()
  {
    static::creating(function (PostExpense $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function postAccountBooks()
  {
    return $this->belongsTo(PostAccountBook::class);
  }
}
