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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id('AnnouncementID');
            //$table->foreignId('AuthorUserID')->constrained('users', 'id')->onDelete('cascade');
            $table->string('Title');
            $table->text('Content');
            $table->dateTime('PublishDate')->useCurrent();
            $table->dateTime('ExpiryDate')->nullable();
            $table->enum('TargetAudience', ['All', 'Students', 'Teachers', 'Parents', 'Staff']);
            $table->boolean('IsPinned')->default(false);
            $table->boolean('IsActive')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
