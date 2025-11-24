<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'UserID' => User::factory(), // can be overridden in seeder
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'MiddleName' => $this->faker->optional()->firstName(),
            'EncryptedPhoneNumber' => null,
            'EncryptedAddress' => null,
            'ProfilePictureURL' => null,
        ];
    }
}
