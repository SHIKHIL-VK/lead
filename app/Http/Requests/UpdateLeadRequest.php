<?php

namespace App\Http\Requests;

use App\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum as EnumRule;
use Propaganistas\LaravelPhone\Rules\Phone;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        // route model binding gives us the lead being edited
        $leadId = $this->route('lead')->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('leads', 'email')->ignore($leadId)],
            'phone' => ['required', (new Phone)->country('IN')->mobile()],
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter the lead name.',
            'name.string' => 'The lead name must be text.',
            'name.max' => 'The lead name may not be longer than 255 characters.',
            'email.required' => 'Please enter an email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'The email address may not be longer than 255 characters.',
            'email.unique' => 'A lead with this email address already exists.',
            'phone.required' => 'Please enter a phone number.',
            'phone.'.Phone::class => 'Please enter a valid Indian mobile number.',
            'status.required' => 'Please select a lead status.',
            'status.'.EnumRule::class => 'Please select a valid lead status.',
        ];
    }
}
