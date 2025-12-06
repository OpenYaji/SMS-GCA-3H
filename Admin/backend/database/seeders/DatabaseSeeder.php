<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StudentProfile;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // // Create admins
        // \App\Models\User::factory()->admin()->count(2)->create();

        // // Create parents
        // \App\Models\User::factory()->parent()->count(20)->create();

        // // Create registrar members
        // \App\Models\User::factory()->registrar()->count(3)->create();

        // Create students (with full linked Profile and StudentProfile)
        \App\Models\StudentProfile::factory()->count(100)->create();

        // // Create teahcers (with full linked Profile and TeahcerProfile)
        // \App\Models\TeacherProfile::factory()->count(20)->create();

        // // Create guards (with full linked Profile and GuardProfile)
        // \App\Models\GuardProfile::factory()->count(20)->create();

        // // Create registrars (with full linked Profile and RegistrarProfile)
        // \App\Models\RegistrarProfile::factory()->count(20)->create();

        // // Create admins (with full linked Profile and AdminProfile)
        // \App\Models\AdminProfile::factory()->count(20)->create();

        // Announcement::factory(100)->create();
        }
}
