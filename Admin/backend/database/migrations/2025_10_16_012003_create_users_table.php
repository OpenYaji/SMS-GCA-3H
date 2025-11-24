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
        Schema::create('User', function (Blueprint $table) {
            $table->id('UserID');
            $table->string('EmailAddress', 255)->unique();
            $table->enum('UserType', ['Admin', 'Teacher', 'Student', 'Parent', 'Registrar', 'Guard']);
            $table->enum('AccountStatus', ['Active', 'Inactive', 'Suspended', 'PendingVerification'])->default('PendingVerification');
            $table->dateTime('LastLoginDate')->nullable();
            $table->dateTime('CreatedAt')->nullable();
            $table->dateTime('UpdatedAt')->nullable();
            $table->boolean('IsDeleted')->default(false);
            $table->dateTime('DeletedAt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
