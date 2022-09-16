<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
