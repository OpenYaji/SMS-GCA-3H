<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'AnnouncementID' => $this->AnnouncementID,
            'Title' => $this->Title,
            'Content' => $this->Content,
            'Summary' => $this->Summary,
            'Category' => $this->Category,
            'PublishDate' => $this->PublishDate,
            'ExpiryDate' => $this->ExpiryDate,
            'TargetAudience' => $this->TargetAudience,
            'IsPinned' => (bool) $this->IsPinned,
            'IsActive' => (bool) $this->IsActive,
            'BannerURL' => $this->BannerURL,
        ];
    }
}
