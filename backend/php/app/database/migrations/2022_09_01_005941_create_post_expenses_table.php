<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostExpensesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('post_expenses', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('expenseItem');
      $table->integer('cost');
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
    Schema::dropIfExists('post_expenses');
  }
}
