import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    status: string;
    [key: string]: string;
}

interface Props {
    data: LeadFormData;
    setData: (key: keyof LeadFormData, value: string) => void;
    errors: Partial<Record<keyof LeadFormData, string>>;
    processing: boolean;
    statuses: string[];
    onSubmit: FormEventHandler;
    submitLabel: string;
}

/**
 * Pure presentational form — no business logic here.
 * All validation and persistence happens server-side; this
 * component only wires controlled inputs to the parent's useForm state.
 */
export default function LeadForm({
    data,
    setData,
    errors,
    processing,
    statuses,
    onSubmit,
    submitLabel,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    autoComplete="name"
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    autoComplete="email"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="phone" value="Phone" />
                <TextInput
                    id="phone"
                    className="mt-1 block w-full"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    autoComplete="tel"
                />
                <InputError message={errors.phone} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Status" />
                <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>{submitLabel}</PrimaryButton>
                <Link
                    href={route('leads.index')}
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
