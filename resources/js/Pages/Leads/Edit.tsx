import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LeadForm from '@/Components/Leads/LeadForm';
import { Lead } from '@/Types/lead';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    lead,
    statuses,
}: {
    lead: Lead;
    statuses: string[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('leads.update', lead.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Lead
                </h2>
            }
        >
            <Head title="Edit Lead" />

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
                            submitLabel="Save Changes"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
