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
        Schema::create('Profile', function (Blueprint $table) {
            $table->id('ProfileID');
            $table->foreignId('UserID')->constrained('User', 'UserID')->onDelete('cascade');
            $table->string('FirstName', 100);
            $table->string('LastName', 100);
            $table->string('MiddleName', 100)->nullable();
            $table->binary('EncryptedPhoneNumber')->nullable();
            $table->binary('EncryptedAddress')->nullable();
            $table->string('ProfilePictureURL', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
