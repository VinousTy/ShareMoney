<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

  public function accountBooks()
  {
    return $this->belongsTo(AccountBook::class);
  }
}
