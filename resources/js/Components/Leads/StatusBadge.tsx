import { LeadStatus } from '@/Types/lead';

const COLORS: Record<LeadStatus, string> = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-amber-100 text-amber-800',
    Converted: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status]}`}
        >
            {status}
        </span>
    );
}
