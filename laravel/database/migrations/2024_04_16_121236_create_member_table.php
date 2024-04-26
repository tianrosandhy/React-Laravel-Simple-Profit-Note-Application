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
        Schema::create('member', function (Blueprint $table) {
            $table->id();
            $table->string('whatsapp_number', 20)->unique();
            $table->string('full_name', 100)->nullable();
            $table->string('merchant_title', 100)->nullable();
            $table->string('image')->nullable();
            $table->string('status', 20)->nullable(); // ACTIVE, BLOCKED, PENDING
            $table->integer('balance')->default('0')->nullable();
            $table->timestamps();
        });

        Schema::create('member_token', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('member_id');
            $table->string('token')->nullable();
            $table->string('device_name', 100)->nullable();
            $table->datetime('expired_date')->nullable();
            $table->timestamps();

            $table->index('member_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member');
        Schema::dropIfExists('member_token');
    }
};
