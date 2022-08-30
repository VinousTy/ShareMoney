<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpensesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('expenses', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('expenseItem');
      $table->integer('cost');
      // $table->uuid('account_book_id');
      // $table->foreign('account_book_id')
      //   ->references("id")
      //   ->on("account_books")
      //   ->onUpdate('cascade')
      //   ->onDelete('cascade');
      $table->uuid('account_book_id');
      $table->foreign('account_book_id')
        ->references("id")
        ->on("account_books")
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
    Schema::dropIfExists('expenses');
  }
}
