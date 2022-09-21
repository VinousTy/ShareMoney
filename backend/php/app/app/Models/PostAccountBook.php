<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostAccountBook extends Model
{
  use HasFactory;

  protected $fillable = [
    'id',
    'date',
    'monthly_income',
    'user_id'
  ];

  public $incrementing = false;

  protected $keyType = 'string';

  protected static function booted()
  {
    static::creating(function (PostAccountBook $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function expenses()
  {
    return $this->hasMany(PostExpense::class);
  }

  public function comments()
  {
    return $this->hasMany(Comment::class);
  }

  public function likes()
  {
    return $this->hasMany(Like::class);
  }

  public function bookmarks()
  {
    return $this->hasMany(Bookmark::class);
  }

  public function scopeJoinProfiles($query)
  {
    return $query->join('profiles', 'post_account_books.user_id', '=', 'profiles.user_id');
  }

  public function scopeJoinPostExpenses($query)
  {
    return $query->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id');
  }

  public function scopeJoinBookmarks($query)
  {
    return $query->join('bookmarks', 'post_account_books.id', '=', 'bookmarks.post_account_book_id')
      ->where('bookmarks.user_id', Auth::id());
  }

  public function scopeSearchName($query, $name)
  {
    return $query->join('profiles', 'post_account_books.user_id', '=', 'profiles.user_id')
      ->where('profiles.name', '=', $name);
  }

  public function scopeSearchIncome($query, $income)
  {
    return $query->join('profiles', 'post_account_books.user_id', '=', 'profiles.user_id')
      ->where('profiles.income', '=', $income);
  }

  public function scopeSearchJob($query, $job)
  {
    return $query->join('profiles', 'post_account_books.user_id', '=', 'profiles.user_id')
      ->where('profiles.job', '=', $job);
  }

  public function scopeSearchComposition($query, $composition)
  {
    return $query->join('profiles', 'post_account_books.user_id', '=', 'profiles.user_id')
      ->where('profiles.composition', '=', $composition);
  }

  public function scopeSatisfyUserQuery($query, $name, $income, $job, $composition)
  {
    return $query->where(function ($query) use ($job, $income, $composition) {
      $query->where('profiles.job', '=', $job)
        ->orWhere('profiles.income', '=', $income)
        ->orWhere('profiles.composition', '=', $composition);
    })->where(function ($query) use ($name) {
      $query->where('profiles.name', '<>', $name);
    })->get(['post_account_books.id', 'post_account_books.user_id', 'post_account_books.date', 'post_account_books.monthly_income']);
  }
}
