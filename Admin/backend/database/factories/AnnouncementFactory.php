<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $targetAudiences = ['All Users', 'Students', 'Teachers', 'Parents', 'Staff'];

        return [
            'AuthorUserID' => 1, //hardcoded for now
            'Title' => $this->faker->sentence(6),
            'Content' => $this->faker->paragraphs(3, true),
            'PublishDate' => now(),
            'ExpiryDate' => $this->faker->optional()->dateTimeBetween('+1 week', '+1 month'),
            'TargetAudience' => $this->faker->randomElement($targetAudiences),
            'IsPinned' => $this->faker->boolean(20),
            'IsActive' => $this->faker->boolean(90),
        ];
    }
}
