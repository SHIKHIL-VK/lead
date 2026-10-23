<?php

namespace App\Services;

use App\Enums\LeadStatus;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadService
{
    private const int PER_PAGE = 10;

    /**
     * @return array{
     *     leads: LengthAwarePaginator,
     *     filters: array{search: string, status: string, sort: string, direction: string}
     * }
     */
    public function paginate(
        string $search,
        string $status,
        string $sort,
        string $direction,
        int $page,
    ): array {
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';
        $sort = $sort === 'created_at' ? $sort : 'created_at';

        return [
            'leads' => Lead::query()
                ->search($search ?: null)
                ->status($status ?: null)
                ->orderBy($sort, $direction)
                ->paginate(perPage: self::PER_PAGE, page: $page),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ];
    }

    public function create(array $attributes, User $creator): Lead
    {
        return Lead::create([
            ...$attributes,
            'created_by' => $creator->id,
        ]);
    }

    public function update(Lead $lead, array $attributes): void
    {
        $lead->update($attributes);
    }

    public function updateStatus(Lead $lead, LeadStatus $status): void
    {
        $lead->update(['status' => $status]);
    }

    public function delete(Lead $lead): void
    {
        $lead->delete();
    }
}
