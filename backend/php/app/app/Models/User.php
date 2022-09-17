<?php

namespace App\Models;

use App\Notifications\PasswordResetNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'id',
    'email',
    'password',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  public $incrementing = false;

  protected $keyType = 'string';

  public function sendPasswordResetNotification($token)
  {
    $this->notify(new PasswordResetNotification($token));
  }

  protected static function booted()
  {
    static::creating(function (User $model) {
      empty($model->id) && $model->id = Str::uuid();
    });
  }

  public function profile()
  {
    return $this->hasOne(Profile::class);
  }

  public function postLikes()
  {
    return $this->belongsToMany(PostAccountBook::class, 'likes', 'user_id', 'post_account_book_id')->withTimestamps();
  }

  public function postBookmarks()
  {
    return $this->belongsToMany(PostAccountBook::class, 'bookmarks', 'user_id', 'post_account_book_id')->withTimestamps();
  }

  public function isLike($postId)
  {
    return $this->postLikes()->where('post_account_book_id', $postId)->exists();
  }

  public function like($postId)
  {
    $exist = $this->isLike($postId);

    if ($exist) {
      return false;
    } else {
      $this->postLikes()->attach($postId);
      return true;
    }
  }

  public function unLike($postId)
  {
    $exist = $this->isLike($postId);

    if ($exist) {
      $this->postLikes()->detach($postId);
      return true;
    } else {
      return false;
    }
  }

  public function isBookmark($postId)
  {
    return $this->postBookmarks()->where('post_account_book_id', $postId)->exists();
  }

  public function bookmark($postId)
  {
    $exist = $this->isBookmark($postId);

    if ($exist) {
      return false;
    } else {
      $this->postBookmarks()->attach($postId);
      return true;
    }
  }

  public function unBookmark($postId)
  {
    $exist = $this->isBookmark($postId);

    if ($exist) {
      $this->postBookmarks()->detach($postId);
      return true;
    } else {
      return false;
    }
  }
}
