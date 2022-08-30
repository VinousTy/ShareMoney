<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Expense extends Model
{
  use HasFactory;

  protected $fillable = [
    'id',
    "expenseItem",
    'cost',
    'account_book_id',
  ];

  public $incrementing = false;

  protected $keyType = 'string';

  protected static function booted()
  {
    static::creating(function (Expense $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function accountBooks()
  {
    return $this->belongsTo(AccountBook::class);
  }
}
