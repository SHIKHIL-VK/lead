<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Lead $lead): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Lead $lead): bool
    {
        return true;
    }

    /**
     * Only the user who created the lead may delete it.
     * (Adjust this rule to match real business requirements,
     * e.g. `$user->is_admin || $user->id === $lead->created_by`)
     */
    public function delete(User $user, Lead $lead): bool
    {
        return $user->id === $lead->created_by;
    }
}
