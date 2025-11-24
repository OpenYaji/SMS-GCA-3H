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
        Schema::create('StudentProfile', function (Blueprint $table) {
            $table->id('StudentProfileID');
            $table->foreignId('ProfileID')->constrained('Profile', 'ProfileID')->onDelete('cascade');
            $table->string('StudentNumber')->unique();
            $table->string('QRCodeID')->unique();
            $table->date('DateOfBirth');
            $table->string('Gender');
            $table->string('Nationality');
            $table->enum('StudentStatus', ['Enrolled', 'Withdrawn', 'Graduated', 'On Leave'])->default('Enrolled');
            $table->date('ArchiveDate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
