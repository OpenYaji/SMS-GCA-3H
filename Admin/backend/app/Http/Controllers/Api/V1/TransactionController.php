<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;

class TransactionController extends Controller
{
    public function index(){
    // Eager load relationships
    $transactions = Transaction::with('studentProfile', 'transactionItems')->paginate(5);
    // Return as a collection of resources
    return TransactionResource::collection($transactions);
    }

    public function show(){
        // For modal if needed
    }
}
