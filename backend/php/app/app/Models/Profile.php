<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Profile extends Model
{
  use HasFactory;

  protected $fillable = [
    'id',
    'name',
    'age',
    'job',
    'income',
    'composition',
    'body',
    'img',
    'user_id',
  ];

  public $incrementing = false;

  protected $keyType = 'string';

  protected static function booted()
  {
    static::creating(function (Profile $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function scopeJoinUsers($query)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id');
  }

  public function scopeJoinPostAccountBooks($query)
  {
    return $query->join('post_account_books', 'users.id', '=', 'post_account_books.user_id');
  }

  public function scopeJoinPostExpenses($query)
  {
    return $query->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id');
  }

  public function scopeSearchName($query, $name)
  {
    return $query->where('profiles.name', '=', $name);
  }

  public function scopeSearchIncome($query, $income)
  {
    return $query->where('profiles.income', '=', $income);
  }

  public function scopeSearchJob($query, $job)
  {
    return $query->where('profiles.job', '=', $job);
  }

  public function scopeSearchComposition($query, $composition)
  {
    return $query->where('profiles.composition', '=', $composition);
  }
}
