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

  public function scopeSearchIncomeName($query, $name)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->selectRaw('post_account_books.date, post_account_books.user_id, sum(post_account_books.monthly_income) as monthly_income')
      ->where('profiles.name', 'like', "%$name%")
      ->groupBy('post_account_books.date', 'post_account_books.user_id');
  }

  public function scopeSearchCostName($query, $name)
  {
    if (!empty($name)) {
      return $query->join('users', 'profiles.user_id', '=', 'users.id')
        ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
        ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
        ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
        ->where('profiles.name', 'like', "%$name%")
        ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
    } else {
      return $query->join('users', 'profiles.user_id', '=', 'users.id')
        ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
        ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
        ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost');
    }
  }

  public function scopeSearchIncome($query, $income)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->selectRaw('post_account_books.date, post_account_books.user_id, sum(post_account_books.monthly_income) as monthly_income')
      ->where('profiles.income', '=', $income)
      ->groupBy('post_account_books.date', 'post_account_books.user_id');
  }

  public function scopeSearchCostIncome($query, $income)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where('profiles.income', '=', $income)
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
  }

  public function scopeSearchJobIncome($query, $job)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->selectRaw('post_account_books.date, post_account_books.user_id, sum(post_account_books.monthly_income) as monthly_income')
      ->where('profiles.job', '=', $job)
      ->groupBy('post_account_books.date', 'post_account_books.user_id');
  }

  public function scopeSearchJobCost($query, $job)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where('profiles.job', '=', $job)
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
  }

  public function scopeSearchCompositionIncome($query, $composition)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->selectRaw('post_account_books.date, post_account_books.user_id, sum(post_account_books.monthly_income) as monthly_income')
      ->where('profiles.composition', '=', $composition)
      ->groupBy('post_account_books.date', 'post_account_books.user_id');
  }

  public function scopeSearchCompositionCost($query, $composition)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where('profiles.composition', '=', $composition)
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
  }

  public function scopeSatisfyUserCosts($query, $name, $income, $job, $composition)
  {
    return $query->join('users', 'profiles.user_id', '=', 'users.id')
      ->join('post_account_books', 'users.id', '=', 'post_account_books.user_id')
      ->join('post_expenses', 'post_account_books.id', '=', 'post_expenses.post_account_book_id')
      ->selectRaw('post_account_books.date ,post_expenses.expenseItem, post_account_books.user_id, sum(post_expenses.cost) as cost')
      ->where(function ($query) use ($job, $income, $composition) {
        $query->where('profiles.job', '=', $job)
          ->orWhere('profiles.income', '=', $income)
          ->orWhere('profiles.composition', '=', $composition);
      })->where(function ($query) use ($name) {
        $query->where('profiles.name', '<>', $name);
      })
      ->groupBy('post_account_books.date', 'post_expenses.expenseItem', 'post_account_books.user_id');
  }
}
