<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostAccountBooksTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('post_account_books', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('date');
      $table->integer('monthly_income');
      $table->uuid('user_id');
      $table->foreign('user_id')
        ->references("id")
        ->on("users")
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
    Schema::dropIfExists('post_account_books');
  }
}
