<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherProfile>
 */
class TeacherProfileFactory extends Factory
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
                'UserID' => User::factory()->teacher()->create()->UserID,
            ])->ProfileID,
            'EmployeeNumber' => 'EMP-' . strtoupper($this->faker->unique()->bothify('####')),
            'Specialization' => $this->faker->word(),
            'HireDate' => now(),
        ];
    }
}
