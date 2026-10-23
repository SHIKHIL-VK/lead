import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/Leads/StatusBadge';
import { Lead, LeadFilters, Paginated } from '@/Types/lead';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    leads: Paginated<Lead>;
    filters: LeadFilters;
    statuses: string[];
    flash?: { success?: string };
}

export default function Index({ leads, filters, statuses, flash }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
        null,
    );
    const isFirstRender = useRef(true);

    /**
     * All listing state (search / status / sort / page) is sent via POST
     * to keep it out of the URL query string, while still going through
     * a normal Inertia page visit (no separate JSON API endpoint).
     */
    const applyFilters = (overrides: Partial<LeadFilters & { page: number }> = {}) => {
        router.post(
            route('leads.filter'),
            {
                search,
                status,
                sort: filters.sort,
                direction: filters.direction,
                page: 1,
                ...overrides,
            },
            {
                preserveState: true,
                preserveScroll: true,
                preserveUrl: true,
                only: ['leads', 'filters'],
            },
        );
    };

    // Debounce search input so we don't fire a request on every keystroke.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => applyFilters({ search }), 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleStatusFilterChange = (value: string) => {
        setStatus(value);
        applyFilters({ status: value });
    };

    const toggleSort = () => {
        applyFilters({
            sort: 'created_at',
            direction: filters.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    const goToPage = (page: number) => {
        applyFilters({ page });
    };

    const handleInlineStatusChange = (lead: Lead, value: string) => {
        router.patch(
            route('leads.status.update', lead.id),
            { status: value },
            { preserveScroll: true },
        );
    };

    const confirmDelete = (id: number) => setConfirmingDeleteId(id);

    const performDelete = () => {
        if (confirmingDeleteId === null) return;
        router.delete(route('leads.destroy', confirmingDeleteId), {
            preserveScroll: true,
            onFinish: () => setConfirmingDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Leads
                    </h2>
                    <Link
                        href={route('leads.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        + New Lead
                    </Link>
                </div>
            }
        >
            <Head title="Leads" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        {/* Filters */}
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs"
                            />

                            <select
                                value={status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-48"
                            >
                                <option value="">All statuses</option>
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">Name</th>
                                        <th className="py-2 pr-4 font-medium">Email</th>
                                        <th className="py-2 pr-4 font-medium">Phone</th>
                                        <th className="py-2 pr-4 font-medium">Status</th>
                                        <th className="py-2 pr-4 font-medium">
                                            <button
                                                type="button"
                                                onClick={toggleSort}
                                                className="flex items-center gap-1 hover:text-gray-800"
                                            >
                                                Created At
                                                <span>
                                                    {filters.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            </button>
                                        </th>
                                        <th className="py-2 pr-4 font-medium text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leads.data.map((lead) => (
                                        <tr key={lead.id}>
                                            <td className="py-3 pr-4">{lead.name}</td>
                                            <td className="py-3 pr-4">{lead.email}</td>
                                            <td className="py-3 pr-4">{lead.phone}</td>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={lead.status} />
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) =>
                                                            handleInlineStatusChange(
                                                                lead,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="rounded border-gray-200 text-xs"
                                                    >
                                                        {statuses.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 pr-4 text-right">
                                                <Link
                                                    href={route('leads.edit', lead.id)}
                                                    className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => confirmDelete(lead.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {leads.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-6 text-center text-gray-400"
                                            >
                                                No leads found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Page {leads.current_page} of {leads.last_page} (
                                {leads.total} total)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={leads.current_page <= 1}
                                    onClick={() => goToPage(leads.current_page - 1)}
                                    className="rounded border px-3 py-1 disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={leads.current_page >= leads.last_page}
                                    onClick={() => goToPage(leads.current_page + 1)}
                                    className="rounded border px-3 py-1 disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {confirmingDeleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-medium text-gray-900">
                            Delete this lead?
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmingDeleteId(null)}
                                className="rounded-md border px-4 py-2 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={performDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
