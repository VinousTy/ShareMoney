<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('profiles', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('name');
      $table->integer('age');
      $table->string('job');
      $table->string('income');
      $table->string('composition');
      $table->text('body');
      $table->string('img')->nullable();
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
    Schema::dropIfExists('profiles');
  }
}
