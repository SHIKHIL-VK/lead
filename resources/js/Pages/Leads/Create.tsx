import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LeadForm from '@/Components/Leads/LeadForm';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ statuses }: { statuses: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        status: statuses[0] ?? 'New',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('leads.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Lead
                </h2>
            }
        >
            <Head title="Create Lead" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <LeadForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            statuses={statuses}
                            onSubmit={submit}
                            submitLabel="Create Lead"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
