<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LeadControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_the_lead_listing(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/leads');

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Leads/Index'));
    }

    public function test_invalid_lead_phone_shows_a_specific_validation_message(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/leads/create')
            ->post('/leads', [
                'name' => 'Example Lead',
                'email' => 'lead@example.com',
                'phone' => '123',
                'status' => 'New',
            ]);

        $response->assertSessionHasErrors([
            'phone' => 'Please enter a valid Indian mobile number, e.g. 9876543210.',
        ]);
    }

    public function test_invalid_lead_phone_on_update_shows_a_specific_validation_message(): void
    {
        $user = User::factory()->create();
        $lead = Lead::factory()->create(['created_by' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->from("/leads/{$lead->id}/edit")
            ->put("/leads/{$lead->id}", [
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => '123',
                'status' => $lead->status->value,
            ]);

        $response->assertSessionHasErrors([
            'phone' => 'Please enter a valid Indian mobile number, e.g. 9876543210.',
        ]);
    }
}
