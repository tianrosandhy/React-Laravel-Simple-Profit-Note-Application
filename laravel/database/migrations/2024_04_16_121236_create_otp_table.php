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
        Schema::create('otp', function (Blueprint $table) {
            $table->id();
            $table->string('whatsapp_number', 20);
            $table->unsignedInteger('member_id')->nullable();
            $table->string('scope', 20); // REGISTER, LOGIN
            $table->string('otp', 20)->nullable();
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
        Schema::dropIfExists('otp');
    }
};
