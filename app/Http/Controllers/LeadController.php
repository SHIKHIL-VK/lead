<?php

namespace App\Http\Controllers;

use App\Enums\LeadStatus;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use App\Services\LeadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function __construct(private readonly LeadService $leadService) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Lead::class);

        $listing = $this->leadService->paginate(
            search: $request->string('search')->toString(),
            status: $request->string('status')->toString(),
            sort: $request->string('sort', 'created_at')->toString(),
            direction: $request->string('direction', 'desc')->toString(),
            page: (int) $request->input('page', 1),
        );

        return Inertia('Leads/Index', [
            ...$listing,
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Lead::class);

        return Inertia::render('Leads/Create', [
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $this->authorize('create', Lead::class);

        $this->leadService->create($request->validated(), $request->user());

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead created successfully.');
    }

    public function edit(Lead $lead): Response
    {
        $this->authorize('update', $lead);

        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);

        $this->leadService->update($lead, $request->validated());

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    public function updateStatus(Request $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ]);

        $this->leadService->updateStatus(
            $lead,
            LeadStatus::from($validated['status']),
        );

        return back()->with('success', 'Status updated.');
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $this->authorize('delete', $lead);

        $this->leadService->delete($lead);

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}
