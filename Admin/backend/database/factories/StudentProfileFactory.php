<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentProfile>
 */
class StudentProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ProfileID' => Profile::factory()->create([
                'UserID' => User::factory()->student()->create()->UserID,
            ])->ProfileID,
            'StudentNumber' => 'STU-' . strtoupper($this->faker->unique()->bothify('####')),
            'QRCodeID' => strtoupper($this->faker->unique()->bothify('QR####')),
            'DateOfBirth' => $this->faker->date('Y-m-d', '-18 years'),
            'Gender' => $this->faker->randomElement(['Male', 'Female']),
            'Nationality' => $this->faker->country(),
            'StudentStatus' => 'Enrolled',
            'ArchiveDate' => null,
        ];
    }
}
