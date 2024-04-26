<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('member_id');
            $table->unsignedInteger('wallet_id')->nullable();
            $table->unsignedInteger('label_id')->nullable();
            $table->integer('expense')->nullable();
            $table->integer('income')->nullable();
            $table->string('notes')->nullable();
            $table->date('transaction_date')->nullable();
            $table->timestamps();

            $table->index('wallet_id');
            $table->index('label_id');
            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction');
    }
};
