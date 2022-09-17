<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookmarksTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('bookmarks', function (Blueprint $table) {
      $table->id();
      $table->uuid('user_id');
      $table->foreign('user_id')
        ->references("id")
        ->on("users")
        ->onUpdate('cascade')
        ->onDelete('cascade');
      $table->uuid('post_account_book_id');
      $table->foreign('post_account_book_id')
        ->references("id")
        ->on("post_account_books")
        ->onUpdate('cascade')
        ->onDelete('cascade');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('bookmarks');
  }
}
