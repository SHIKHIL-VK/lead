# Lead Management Module — Laravel 12 + Inertia.js + React

This repo contains **only the custom files** for the Lead Management module.
It is meant to be dropped into a fresh Laravel 12 + Breeze (React + TypeScript)
installation, because Breeze already generates all the standard auth
scaffolding (login, register, layouts, `InputError`, `PrimaryButton`, etc.)
that this test explicitly allows you to reuse.

## Versions used
- PHP 8.3
- Laravel 12
- Node 20.x / npm 10.x
- Composer 2.x

## Setup — from scratch

```bash
# 1. Create a fresh Laravel 12 project
composer create-project laravel/laravel lead-management
cd lead-management

# 2. Install Breeze with the React + TypeScript stack (Inertia)
composer require laravel/breeze --dev
php artisan breeze:install react --typescript

# 3. Copy the files from this submission into the new project,
#    overwriting routes/web.php and app/Providers/AppServiceProvider.php
#    (merge them if you changed anything else in those two files).
cp -r app/Enums            <path-to>/lead-management/app/
cp -r app/Models/Lead.php  <path-to>/lead-management/app/Models/
cp -r app/Http/Requests/*  <path-to>/lead-management/app/Http/Requests/
cp -r app/Http/Controllers/LeadController.php <path-to>/lead-management/app/Http/Controllers/
cp -r app/Policies         <path-to>/lead-management/app/
cp    app/Providers/AppServiceProvider.php    <path-to>/lead-management/app/Providers/
cp    routes/web.php       <path-to>/lead-management/routes/
cp -r database/migrations/2025_01_01_000001_create_leads_table.php <path-to>/lead-management/database/migrations/
cp    database/factories/LeadFactory.php  <path-to>/lead-management/database/factories/
cp    database/seeders/LeadSeeder.php     <path-to>/lead-management/database/seeders/
cp -r resources/js/Pages/Leads       <path-to>/lead-management/resources/js/Pages/
cp -r resources/js/Components/Leads  <path-to>/lead-management/resources/js/Components/
cp -r resources/js/Types             <path-to>/lead-management/resources/js/

# 4. Environment
cp .env.example .env
php artisan key:generate
# edit .env with your DB credentials

# 5. Share flash messages with Inertia (one-line change)
# In app/Http/Middleware/HandleInertiaRequests.php, inside share():
#   'flash' => [
#       'success' => fn () => $request->session()->get('success'),
#   ],

# 6. Run migrations (+ optional demo data)
php artisan migrate
php artisan db:seed --class=Database\\Seeders\\LeadSeeder   # requires a registered user first

# 7. Install JS deps and build
npm install
npm run dev      # or: npm run build

# 8. Serve
php artisan serve
```

Register a user at `/register`, log in, then visit `/leads`.

## What's implemented

### Authentication
Laravel Breeze (React/Inertia stack). All `leads.*` routes sit behind the
`auth` middleware in `routes/web.php`.

### Lead CRUD
- `leads` table: `name`, `email` (unique), `phone`, `status` (enum-backed
  string), `created_by`, timestamps, soft deletes.
- `App\Enums\LeadStatus` is the single source of truth for valid statuses
  — used in validation (`Rule::enum`), the model cast, and the options sent
  to the frontend. No hardcoded status strings anywhere.
- `StoreLeadRequest` / `UpdateLeadRequest` handle all validation server-side;
  errors flow back through Inertia's shared error bag and are rendered
  under each field via `<InputError>`.
- `LeadController` is a thin resource controller — query building (search /
  filter / sort) lives in model query scopes (`scopeSearch`, `scopeStatus`),
  keeping business logic out of the controller and out of React.

### Listing page (`Pages/Leads/Index.tsx`)
- Paginated (10/page), search by name/email, filter by status, sort by
  `created_at` (asc/desc).
- Per the test's constraint of **not** putting filter params in the URL,
  search/filter/sort/pagination are all sent via `router.post()` to a
  dedicated `leads.filter` route (still an Inertia page response, not a
  JSON API) with `preserveUrl: true`, so the address bar always stays at
  `/leads`.
- Search is debounced (400ms) to avoid a request per keystroke.
- Bonus: inline status change per row via `PATCH /leads/{lead}/status`.

### Create / Edit
- Both pages use Inertia's `useForm`, sharing one presentational
  `<LeadForm>` component (controlled inputs, no logic beyond wiring state).

### Delete
- Confirmation modal before `router.delete()`.
- Soft deletes enabled (`SoftDeletes` trait + `deleted_at` column).

### Authorization
- `LeadPolicy` — `viewAny`/`view`/`create`/`update` allowed for any
  authenticated user; `delete` restricted to the user who created the lead.
  Registered in `AppServiceProvider::boot()`.

## Notes / assumptions
- No API routes were added for listing/CRUD — everything goes through
  Inertia page responses, per the spec.
- UI is intentionally minimal (Tailwind utility classes from Breeze's
  default styling) — functionality and code structure were prioritized
  over pixel-perfect design, as allowed by the brief.

## Time taken
Approximately **X hours** (fill in based on your actual time).
