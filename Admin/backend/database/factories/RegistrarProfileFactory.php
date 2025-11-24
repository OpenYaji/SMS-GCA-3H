<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RegistrarProfile>
 */
class RegistrarProfileFactory extends Factory
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
                'UserID' => User::factory()->guard()->create()->UserID,
            ])->ProfileID,
            'EmployeeNumber' => 'EMP-' . strtoupper($this->faker->unique()->bothify('####')),
            'HireDate' => now(),
        ];
    }
}
