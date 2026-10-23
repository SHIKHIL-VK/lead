# Lead Management

A lead-management web application built with Laravel 13, Inertia.js, and React. Users can manage leads from an authenticated interface without a separate JSON API.

## Requirements

- PHP 8.3 or later
- Composer
- Node.js and npm
- SQLite (the default database)

## Getting started

From the project root:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000). You can register an account at `/register` or sign in with the development account created by the database seeder:

- Email: `test@example.com`
- Password: `password`

The seeded credentials are for local development only. Do not use them in a deployed environment.

For frontend hot reload during development, run `npm run dev` in a second terminal instead of building assets with `npm run build`.

To add sample leads after migrating and seeding the user, run:

```bash
php artisan db:seed --class=LeadSeeder
```

## Features

- Create, list, edit, and soft-delete leads.
- Search leads by name or email; filter by status; sort by creation date.
- Browse paginated results (10 leads per page) and change a lead's status inline.
- Validate unique email addresses and Indian mobile phone numbers.
- Restrict lead management routes to authenticated users. Authenticated users can view and update leads; only the lead's creator can delete it.

Lead statuses are `New`, `Contacted`, and `Converted`.

## Development

Run the test suite with:

```bash
php artisan test
```

The lead feature is implemented in `app/Http/Controllers/LeadController.php` and `app/Services/LeadService.php`, with validation in `app/Http/Requests/`. The React/Inertia pages are under `resources/js/Pages/Leads/`.
