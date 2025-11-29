<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'TransactionID' => $this->TransactionID,
            'TotalAmount' => $this->TotalAmount,
            'PaidAmount' => $this->PaidAmount,
            'BalanceAmount' => $this->BalanceAmount,
            'IssueDate' => $this->IssueDate,
            'DueDate' => $this->DueDate,
            'Student' => [
                'FirstName' => $this->studentProfile?->profile?->FirstName,
                'LastName' => $this->studentProfile?->profile?->LastName
            ],
            'Items' => $this->transactionItems->map(function ($item) {
                return [
                    'Type' => $item->Description // already in TransactionItem
                ];
            }),
        ];
    }
}
