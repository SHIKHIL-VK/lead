<?php

namespace App\Providers;

use App\Models\Lead;
use App\Policies\LeadPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Laravel auto-discovers policies named `{Model}Policy` in App\Policies,
        // this explicit registration is kept for clarity / IDE navigation.
        Gate::policy(Lead::class, LeadPolicy::class);
    }
}
