<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AccountBook extends Model
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
    static::creating(function (AccountBook $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function expenses()
  {
    return $this->hasMany(Expense::class);
  }
}
