<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        $userId = User::first()?->id;

        Lead::factory()
            ->count(35)
            ->create(['created_by' => $userId]);
    }
}
