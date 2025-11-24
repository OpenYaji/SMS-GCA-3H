<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    // protected static ?string $password;

    // /**
    //  * Define the model's default state.
    //  *
    //  * @return array<string, mixed>
    //  */
    // public function definition(): array
    // {
    //     return [
    //         'name' => fake()->name(),
    //         'email' => fake()->unique()->safeEmail(),
    //         'email_verified_at' => now(),
    //         'password' => static::$password ??= Hash::make('password'),
    //         'remember_token' => Str::random(10),
    //     ];
    // }

    // /**
    //  * Indicate that the model's email address should be unverified.
    //  */
    // public function unverified(): static
    // {
    //     return $this->state(fn (array $attributes) => [
    //         'email_verified_at' => null,
    //     ]);
    // }


    // all codes above are defaults for user by laravel
    // added:
    public function definition(): array
    {
        return [
            'EmailAddress' => $this->faker->unique()->safeEmail(),
            'UserType' => 'Student', // default type, can be overridden in seeder
            'AccountStatus' => 'PendingVerification',
            'LastLoginDate' => null,
            'CreatedAt' => now(),
            'UpdatedAt' => now(),
            'IsDeleted' => false,
            'DeletedAt' => null,
        ];
    }

    // Usertype States
    public function admin(): static
    {
        return $this->state(['UserType' => 'Admin']);
    }

    public function teacher(): static
    {
        return $this->state(['UserType' => 'Teacher']);
    }

    public function student(): static
    {
        return $this->state(['UserType' => 'Student']);
    }

    public function parent(): static
    {
        return $this->state(['UserType' => 'Parent']);
    }

    public function registrar(): static
    {
        return $this->state(['UserType' => 'Registrar']);
    }

    public function guard(): static
    {
        return $this->state(['UserType' => 'Guard']);
    }
}
